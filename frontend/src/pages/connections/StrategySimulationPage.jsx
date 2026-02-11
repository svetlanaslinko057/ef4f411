/**
 * Strategy Simulation Page (Block 28)
 * 
 * Research interface for testing behavioral strategies
 */

import React, { useEffect, useState, useCallback } from 'react';
import { 
  LineChart, Play, RefreshCw, TrendingUp, TrendingDown, 
  AlertCircle, CheckCircle, BarChart2, Target, Zap, Filter
} from 'lucide-react';
import { 
  fetchStrategies, 
  runStrategySimulation, 
  fetchStrategyReport,
  compareStrategies 
} from '../../api/blocks15-28.api';

const STRATEGY_ICONS = {
  EARLY_CONVICTION_ONLY: Zap,
  LONG_TERM_ACCUMULATORS: TrendingUp,
  HIGH_AUTHENTICITY: CheckCircle,
  AVOID_PUMP_EXIT: AlertCircle
};

const STRATEGY_COLORS = {
  EARLY_CONVICTION_ONLY: 'purple',
  LONG_TERM_ACCUMULATORS: 'emerald',
  HIGH_AUTHENTICITY: 'blue',
  AVOID_PUMP_EXIT: 'orange'
};

function MetricCard({ label, value, suffix = '', trend, description }) {
  const isPositive = trend === 'positive';
  const isNegative = trend === 'negative';
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className={`text-2xl font-bold ${
          isPositive ? 'text-green-500' : isNegative ? 'text-red-500' : 'text-gray-900 dark:text-white'
        }`}>
          {typeof value === 'number' ? value.toFixed(1) : value}
        </span>
        <span className="text-sm text-gray-500">{suffix}</span>
      </div>
      {description && (
        <div className="text-xs text-gray-400 mt-1">{description}</div>
      )}
    </div>
  );
}

function StrategyCard({ strategy, onSelect, selected }) {
  const Icon = STRATEGY_ICONS[strategy.name] || BarChart2;
  const color = STRATEGY_COLORS[strategy.name] || 'gray';
  
  return (
    <button
      onClick={() => onSelect(strategy.name)}
      className={`w-full text-left p-4 rounded-lg border transition-all ${
        selected 
          ? `bg-${color}-50 dark:bg-${color}-900/20 border-${color}-300 dark:border-${color}-700` 
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/30`}>
          <Icon className={`w-5 h-5 text-${color}-600 dark:text-${color}-400`} />
        </div>
        <div>
          <div className="font-medium text-gray-900 dark:text-white">
            {strategy.name.replace(/_/g, ' ')}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {strategy.description}
          </div>
        </div>
      </div>
    </button>
  );
}

export default function StrategySimulationPage() {
  const [strategies, setStrategies] = useState([]);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [windowDays, setWindowDays] = useState(30);

  // Load strategies
  useEffect(() => {
    async function load() {
      setLoading(true);
      const result = await fetchStrategies();
      if (result?.strategies) {
        setStrategies(result.strategies);
        if (result.strategies.length > 0) {
          setSelectedStrategy(result.strategies[0].name);
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  // Load report when strategy selected
  useEffect(() => {
    async function loadReport() {
      if (!selectedStrategy) return;
      const result = await fetchStrategyReport(selectedStrategy);
      if (result?.report) {
        setReport(result.report);
      } else {
        setReport(null);
      }
    }
    loadReport();
  }, [selectedStrategy]);

  const handleRunSimulation = useCallback(async () => {
    if (!selectedStrategy) return;
    setRunning(true);
    const result = await runStrategySimulation(selectedStrategy, windowDays, 100);
    if (result?.report) {
      setReport(result.report);
    }
    setRunning(false);
  }, [selectedStrategy, windowDays]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <LineChart className="w-6 h-6 text-purple-500" />
              Strategy Simulation
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Research: What if you followed specific actor types?
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Strategies List */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-500" />
                Available Strategies
              </h2>
              
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin text-purple-500" />
                </div>
              ) : (
                <div className="space-y-3">
                  {strategies.map((strategy) => (
                    <StrategyCard
                      key={strategy.name}
                      strategy={strategy}
                      selected={selectedStrategy === strategy.name}
                      onSelect={setSelectedStrategy}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Simulation Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500 dark:text-gray-400">
                    Window: {windowDays} days
                  </label>
                  <input
                    type="range"
                    min="7"
                    max="90"
                    value={windowDays}
                    onChange={(e) => setWindowDays(Number(e.target.value))}
                    className="w-full mt-1"
                  />
                </div>
                
                <button
                  onClick={handleRunSimulation}
                  disabled={!selectedStrategy || running}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50"
                >
                  {running ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  Run Simulation
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            {report ? (
              <>
                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <MetricCard
                    label="Hit Rate"
                    value={report.metrics.hitRate * 100}
                    suffix="%"
                    trend={report.metrics.hitRate >= 0.6 ? 'positive' : report.metrics.hitRate < 0.4 ? 'negative' : null}
                    description="Events with confirmation"
                  />
                  <MetricCard
                    label="Avg Follow Through"
                    value={report.metrics.avgFollowThrough}
                    suffix="%"
                    trend={report.metrics.avgFollowThrough > 0 ? 'positive' : 'negative'}
                    description="Average price move"
                  />
                  <MetricCard
                    label="Noise Ratio"
                    value={report.metrics.noiseRatio * 100}
                    suffix="%"
                    trend={report.metrics.noiseRatio < 0.3 ? 'positive' : 'negative'}
                    description="False positives"
                  />
                  <MetricCard
                    label="Sample Size"
                    value={report.metrics.sampleSize}
                    description="Events analyzed"
                  />
                </div>

                {/* Strategy Description */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {report.strategy.replace(/_/g, ' ')}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Window: {report.window}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {report.description}
                  </p>
                  
                  {/* Visual Summary */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${
                        report.metrics.hitRate >= 0.6 ? 'text-green-500' :
                        report.metrics.hitRate >= 0.4 ? 'text-yellow-500' : 'text-red-500'
                      }`}>
                        {report.metrics.hitRate >= 0.6 ? 'A' :
                         report.metrics.hitRate >= 0.5 ? 'B' :
                         report.metrics.hitRate >= 0.4 ? 'C' : 'D'}
                      </div>
                      <div className="text-sm text-gray-500">Reliability Grade</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-3xl font-bold">
                        {report.metrics.avgFollowThrough > 0 ? (
                          <TrendingUp className="w-8 h-8 text-green-500" />
                        ) : (
                          <TrendingDown className="w-8 h-8 text-red-500" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500">Direction Bias</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${
                        report.metrics.noiseRatio < 0.25 ? 'text-green-500' :
                        report.metrics.noiseRatio < 0.4 ? 'text-yellow-500' : 'text-red-500'
                      }`}>
                        {report.metrics.noiseRatio < 0.25 ? 'Low' :
                         report.metrics.noiseRatio < 0.4 ? 'Med' : 'High'}
                      </div>
                      <div className="text-sm text-gray-500">Noise Level</div>
                    </div>
                  </div>
                </div>

                {/* Events */}
                {report.events?.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        Recent Events ({report.events.length})
                      </h3>
                    </div>
                    <div className="overflow-x-auto max-h-80">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actor</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Move 24h</th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Outcome</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {report.events.slice(0, 20).map((event, i) => (
                            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                              <td className="px-4 py-2 text-sm text-gray-900 dark:text-white">{event.actorId}</td>
                              <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">{event.asset}</td>
                              <td className={`px-4 py-2 text-sm text-right font-medium ${
                                event.movePercent > 0 ? 'text-green-500' : 'text-red-500'
                              }`}>
                                {event.movePercent > 0 ? '+' : ''}{event.movePercent?.toFixed(1)}%
                              </td>
                              <td className="px-4 py-2 text-center">
                                {event.wasConfirmed ? (
                                  <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-red-500 mx-auto" />
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-12 border border-gray-200 dark:border-gray-700 text-center">
                <LineChart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select a Strategy
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Choose a strategy and run simulation to see results
                </p>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-700 dark:text-yellow-300">
                  <p className="font-medium mb-1">Research Tool - Not Financial Advice</p>
                  <p className="text-yellow-600 dark:text-yellow-400">
                    This simulation analyzes historical behavior patterns. Past performance does not 
                    guarantee future results. Use for research and understanding market dynamics only.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
