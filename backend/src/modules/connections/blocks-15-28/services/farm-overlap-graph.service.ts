/**
 * BLOCK 19 - Farm Overlap Graph Service
 * 
 * Builds graph of shared suspicious followers between influencers
 */

import type { Db, Collection, Document } from 'mongodb';
import { computeJaccard, computeOverlapScore, computeClusterConcentration } from '../formulas/farm-overlap.scoring.js';

export interface FarmOverlapEdge {
  a: string;
  b: string;
  sharedSuspects: number;
  sharedTotal: number;
  jaccard: number;
  overlapScore: number;
  topClusters: Array<{ hash: string; cnt: number }>;
  updatedAt: Date;
}

export interface FarmGraphData {
  nodes: Array<{ id: string; type: string }>;
  edges: FarmOverlapEdge[];
}

export class FarmOverlapGraphService {
  private actorFollowers: Collection<Document>;
  private followerFlags: Collection<Document>;
  private farmEdges: Collection<Document>;

  constructor(private db: Db) {
    this.actorFollowers = db.collection('actor_followers');
    this.followerFlags = db.collection('follower_flags');
    this.farmEdges = db.collection('farm_overlap_edges');
  }

  /**
   * Recompute farm overlap graph
   */
  async recompute(params: {
    actorIds: string[];
    minSharedSuspects?: number;
    limitPairs?: number;
  }): Promise<{ edges: number; updatedAt: string }> {
    const { actorIds, minSharedSuspects = 8, limitPairs = 200 } = params;

    // Get raw overlaps from simplified pipeline
    const raw = await this.computeOverlaps(actorIds, minSharedSuspects, limitPairs);

    // Get suspect counts per actor
    const suspectTotals = new Map<string, number>();
    for (const id of actorIds) {
      suspectTotals.set(id, await this.countSuspects(id));
    }

    // Enrich with jaccard and overlap score
    const now = new Date();
    const edges: FarmOverlapEdge[] = raw.map((e: any) => {
      const aTotal = suspectTotals.get(e.a) ?? 0;
      const bTotal = suspectTotals.get(e.b) ?? 0;

      const jaccard = computeJaccard(e.sharedSuspects, aTotal, bTotal);
      const conc = computeClusterConcentration(e.topClusters ?? [], e.sharedSuspects);
      const overlapScore = computeOverlapScore({
        sharedSuspects: e.sharedSuspects,
        jaccard,
        clusterConcentration: conc
      });

      return {
        a: e.a,
        b: e.b,
        sharedSuspects: e.sharedSuspects,
        sharedTotal: e.sharedSuspects,
        jaccard: Math.round(jaccard * 10000) / 10000,
        overlapScore: Math.round(overlapScore * 10000) / 10000,
        topClusters: e.topClusters ?? [],
        updatedAt: now
      };
    });

    // Upsert edges
    for (const ed of edges) {
      await this.farmEdges.updateOne(
        { a: ed.a, b: ed.b },
        { $set: ed },
        { upsert: true }
      );
    }

    return { edges: edges.length, updatedAt: now.toISOString() };
  }

  /**
   * Get farm graph data
   */
  async getGraph(params: { minScore?: number; limit?: number }): Promise<FarmGraphData> {
    const { minScore = 0.35, limit = 200 } = params;

    const edges = await this.farmEdges
      .find({ overlapScore: { $gte: minScore } })
      .sort({ overlapScore: -1 })
      .limit(limit)
      .toArray() as unknown as FarmOverlapEdge[];

    const nodesSet = new Set<string>();
    edges.forEach(e => {
      nodesSet.add(e.a);
      nodesSet.add(e.b);
    });

    const nodes = Array.from(nodesSet).map(id => ({ id, type: 'ACTOR' }));

    return { nodes, edges };
  }

  /**
   * Count suspects for an actor
   */
  private async countSuspects(actorId: string): Promise<number> {
    const result = await this.actorFollowers.aggregate([
      { $match: { actorId } },
      {
        $lookup: {
          from: 'follower_flags',
          localField: 'followerId',
          foreignField: 'followerId',
          as: 'flag'
        }
      },
      { $unwind: '$flag' },
      { $match: { 'flag.isSuspect': true } },
      { $count: 'n' }
    ]).toArray();

    return result[0]?.n ?? 0;
  }

  /**
   * Compute overlaps using simplified approach
   */
  private async computeOverlaps(
    actorIds: string[],
    minShared: number,
    limit: number
  ): Promise<any[]> {
    // Simplified: get suspect followers per actor and compute pairs in memory
    const suspectsByActor = new Map<string, Set<string>>();

    for (const actorId of actorIds) {
      const suspects = await this.actorFollowers.aggregate([
        { $match: { actorId } },
        {
          $lookup: {
            from: 'follower_flags',
            localField: 'followerId',
            foreignField: 'followerId',
            as: 'flag'
          }
        },
        { $unwind: '$flag' },
        { $match: { 'flag.isSuspect': true } },
        { $project: { followerId: 1 } }
      ]).toArray();

      suspectsByActor.set(actorId, new Set(suspects.map(s => s.followerId)));
    }

    // Compute pairs
    const results: any[] = [];
    const actorList = Array.from(suspectsByActor.keys());

    for (let i = 0; i < actorList.length; i++) {
      for (let j = i + 1; j < actorList.length; j++) {
        const a = actorList[i];
        const b = actorList[j];
        const setA = suspectsByActor.get(a)!;
        const setB = suspectsByActor.get(b)!;

        let shared = 0;
        for (const id of setA) {
          if (setB.has(id)) shared++;
        }

        if (shared >= minShared) {
          results.push({
            a,
            b,
            sharedSuspects: shared,
            topClusters: []
          });
        }
      }
    }

    return results.sort((x, y) => y.sharedSuspects - x.sharedSuspects).slice(0, limit);
  }
}
