import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Layers, AlertTriangle, RefreshCw, Eye, ArrowRight, BarChart3 } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const PHASE_COLORS = {
  ACCUMULATION: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300', color: '#3b82f6' },
  IGNITION: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300', color: '#22c55e' },
  EXPANSION: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300', color: '#f59e0b' },
  DISTRIBUTION: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300', color: '#ef4444' },
};

const ERP_COLORS = {
  IMMINENT: { bg: 'bg-red-500', text: 'text-white', icon: '🔥' },
  BUILDING: { bg: 'bg-orange-500', text: 'text-white', icon: '⚡' },
  WATCH: { bg: 'bg-yellow-400', text: 'text-gray-900', icon: '👀' },
  IGNORE: { bg: 'bg-gray-200', text: 'text-gray-600', icon: '—' },
};

const PHASE_INFO = {
  ACCUMULATION: { icon: '🟦', label: 'Accumulation', desc: 'Smart money entering' },
  IGNITION: { icon: '🟩', label: 'Ignition', desc: 'Breakout starting' },
  EXPANSION: { icon: '🟨', label: 'Expansion', desc: 'Crowd inside' },
  DISTRIBUTION: { icon: '🟥', label: 'Distribution', desc: 'Smart money exiting' },
};

export default function LifecyclePage() {
  const [assetStates, setAssetStates] = useState([]);
  const [clusterStates, setClusterStates] = useState([]);
  const [earlyRotations, setEarlyRotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCluster, setSelectedCluster] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [assetsRes, clustersRes, rotationsRes] = await Promise.all([
        fetch(`${API_URL}/api/connections/lifecycle`),
        fetch(`${API_URL}/api/connections/cluster-lifecycle`),
        fetch(`${API_URL}/api/connections/early-rotation/active`),
      ]);

      const assetsData = await assetsRes.json();
      const clustersData = await clustersRes.json();
      const rotationsData = await rotationsRes.json();

      if (assetsData.ok) setAssetStates(assetsData.data || []);
      if (clustersData.ok) setClusterStates(clustersData.data || []);
      if (rotationsData.ok) setEarlyRotations(rotationsData.data || []);
    } catch (err) {
      console.error('Failed to load lifecycle data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Phase distribution bar
  const PhaseBar = ({ scores }) => {
    const phases = ['accumulation', 'ignition', 'expansion', 'distribution'];
    const colors = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];
    
    return (
      <div className="flex h-2 rounded-full overflow-hidden bg-gray-100">
        {phases.map((phase, i) => (
          <div
            key={phase}
            className="transition-all duration-300"
            style={{ 
              width: `${(scores[phase] || 0) * 100}%`,
              backgroundColor: colors[i]
            }}
            title={`${PHASE_INFO[phase.toUpperCase()]?.label}: ${((scores[phase] || 0) * 100).toFixed(0)}%`}
          />
        ))}
      </div>
    );
  };

  // Stats cards
  const stats = {
    assets: assetStates.length,
    clusters: clusterStates.length,
    rotations: earlyRotations.length,
    igniting: assetStates.filter(a => a.state === 'IGNITION').length,
    distributing: assetStates.filter(a => a.state === 'DISTRIBUTION').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="lifecycle-page">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-7 h-7 text-blue-500" />
              Lifecycle Analytics
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Track asset and cluster lifecycle phases in real-time
            </p>
          </div>
          <button 
            onClick={loadData}
            className="p-2 bg-white rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-500">Assets Tracked</div>
            <div className="text-2xl font-bold text-gray-900">{stats.assets}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="text-sm text-gray-500">Clusters</div>
            <div className="text-2xl font-bold text-gray-900">{stats.clusters}</div>
          </div>
          <div className="bg-white rounded-lg border border-green-200 p-4 border-l-4 border-l-green-500">
            <div className="text-sm text-gray-500">🚀 Igniting</div>
            <div className="text-2xl font-bold text-green-600">{stats.igniting}</div>
          </div>
          <div className="bg-white rounded-lg border border-red-200 p-4 border-l-4 border-l-red-500">
            <div className="text-sm text-gray-500">📉 Distributing</div>
            <div className="text-2xl font-bold text-red-600">{stats.distributing}</div>
          </div>
          <div className="bg-white rounded-lg border border-orange-200 p-4 border-l-4 border-l-orange-500">
            <div className="text-sm text-gray-500">⚡ Active Rotations</div>
            <div className="text-2xl font-bold text-orange-600">{stats.rotations}</div>
          </div>
        </div>

        {/* Early Rotation Warnings */}
        {earlyRotations.length > 0 && (
          <div className="mb-6 bg-orange-50 rounded-xl border border-orange-200 p-4">
            <h2 className="text-lg font-semibold text-orange-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Rotation Signals
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {earlyRotations.map((rot, idx) => {
                const colors = ERP_COLORS[rot.class] || ERP_COLORS.IGNORE;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-lg border border-orange-100 p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-gray-800">
                        <span className="font-medium">{rot.fromCluster}</span>
                        <ArrowRight className="w-4 h-4 text-orange-500" />
                        <span className="font-bold">{rot.toCluster}</span>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${colors.bg} ${colors.text}`}>
                        {colors.icon} {rot.class}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1">ERP Score</div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500 rounded-full"
                            style={{ width: `${rot.erp * 100}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-lg font-bold text-orange-600">
                        {(rot.erp * 100).toFixed(0)}%
                      </div>
                    </div>
                    <div className="flex gap-3 mt-2 text-xs text-gray-500">
                      <span>Vol: {rot.notes?.volatility}</span>
                      <span>Funding: {rot.notes?.funding}</span>
                      <span className="text-green-600 font-medium">{rot.notes?.opportunityGrowth}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition ${
              activeTab === 'overview'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Overview
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition ${
              activeTab === 'assets'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Assets
          </button>
          <button
            onClick={() => setActiveTab('clusters')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition ${
              activeTab === 'clusters'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Layers className="w-4 h-4" /> Clusters
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-2 gap-6">
            {/* Assets by Phase */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Assets by Phase</h3>
              <div className="space-y-3">
                {['ACCUMULATION', 'IGNITION', 'EXPANSION', 'DISTRIBUTION'].map(phase => {
                  const count = assetStates.filter(a => a.state === phase).length;
                  const colors = PHASE_COLORS[phase];
                  const info = PHASE_INFO[phase];
                  return (
                    <div key={phase} className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors.bg}`}>
                        <span className="text-lg">{info.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-800">{info.label}</span>
                          <span className="text-lg font-bold text-gray-900">{count}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
                          <div 
                            className="h-full rounded-full transition-all"
                            style={{ 
                              width: `${(count / Math.max(assetStates.length, 1)) * 100}%`,
                              backgroundColor: colors.color
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Clusters by Phase */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-800 mb-4">Clusters by Phase</h3>
              <div className="grid grid-cols-2 gap-3">
                {clusterStates.map(cluster => {
                  const colors = PHASE_COLORS[cluster.state] || PHASE_COLORS.ACCUMULATION;
                  return (
                    <div 
                      key={cluster.cluster}
                      className={`p-3 rounded-lg border-2 ${colors.border} ${colors.bg} cursor-pointer hover:shadow-md transition`}
                      onClick={() => setSelectedCluster(cluster)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-gray-900">{cluster.cluster}</span>
                        <span className={`text-xs font-medium ${colors.text}`}>{cluster.state}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {cluster.assetCount} assets • {(cluster.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Assets Tab */}
        {activeTab === 'assets' && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phase</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confidence</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-1/3">Distribution</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Window</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {assetStates.map((asset) => {
                  const colors = PHASE_COLORS[asset.state] || PHASE_COLORS.ACCUMULATION;
                  const info = PHASE_INFO[asset.state] || {};
                  return (
                    <tr key={asset.asset} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="font-bold text-gray-900 text-lg">{asset.asset}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium ${colors.bg} ${colors.text}`}>
                          {info.icon} {info.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full"
                              style={{ 
                                width: `${asset.confidence * 100}%`,
                                backgroundColor: colors.color
                              }}
                            />
                          </div>
                          <span className="font-medium text-gray-700">{(asset.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <PhaseBar scores={asset.scores} />
                        <div className="flex gap-2 mt-1 text-xs text-gray-400">
                          <span>A:{((asset.scores?.accumulation || 0) * 100).toFixed(0)}%</span>
                          <span>I:{((asset.scores?.ignition || 0) * 100).toFixed(0)}%</span>
                          <span>E:{((asset.scores?.expansion || 0) * 100).toFixed(0)}%</span>
                          <span>D:{((asset.scores?.distribution || 0) * 100).toFixed(0)}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{asset.window}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Clusters Tab */}
        {activeTab === 'clusters' && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {clusterStates.map((cluster) => {
              const colors = PHASE_COLORS[cluster.state] || PHASE_COLORS.ACCUMULATION;
              const info = PHASE_INFO[cluster.state] || {};
              return (
                <div
                  key={cluster.cluster}
                  className={`bg-white rounded-xl border-2 ${colors.border} p-4 shadow-sm hover:shadow-lg transition`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{cluster.cluster}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${colors.bg} ${colors.text}`}>
                      {info.icon} {info.label}
                    </span>
                  </div>
                  
                  <div className="flex items-end gap-2 mb-3">
                    <span className="text-4xl font-bold" style={{ color: colors.color }}>
                      {(cluster.confidence * 100).toFixed(0)}%
                    </span>
                    <span className="text-sm text-gray-500 mb-1">confidence</span>
                  </div>
                  
                  <PhaseBar scores={cluster.scores} />
                  
                  <div className="flex justify-between mt-3 text-sm text-gray-500">
                    <span>{cluster.assetCount} assets</span>
                    <span>{cluster.window} window</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3">Phase Legend</h3>
          <div className="grid grid-cols-4 gap-4">
            {['ACCUMULATION', 'IGNITION', 'EXPANSION', 'DISTRIBUTION'].map(phase => {
              const colors = PHASE_COLORS[phase];
              const info = PHASE_INFO[phase];
              return (
                <div key={phase} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded ${colors.bg}`} style={{ backgroundColor: colors.color }} />
                  <div>
                    <span className="font-medium text-gray-700">{info.icon} {info.label}</span>
                    <span className="text-xs text-gray-400 ml-1">- {info.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
