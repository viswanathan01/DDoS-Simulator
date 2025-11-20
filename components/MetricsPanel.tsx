import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ServerStatus } from '../types';

interface MetricsPanelProps {
  history: { time: string; load: number; rps: number }[];
  status: ServerStatus;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ history, status }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
      {/* Stat Cards */}
      <div className="col-span-1 space-y-4">
        <div className={`p-4 rounded-lg border ${status.isDown ? 'bg-red-900/20 border-cyber-danger' : 'bg-cyber-panel border-gray-700'}`}>
          <h3 className="text-gray-400 text-sm font-mono mb-1">SERVER STATUS</h3>
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${status.isDown ? 'bg-cyber-danger animate-ping' : 'bg-cyber-success'}`}></div>
            <span className={`text-2xl font-bold ${status.isDown ? 'text-cyber-danger' : 'text-cyber-success'}`}>
              {status.isDown ? 'CRITICAL FAILURE' : 'ONLINE'}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-cyber-panel border border-gray-700">
          <h3 className="text-gray-400 text-sm font-mono mb-1">CPU LOAD</h3>
          <div className="flex items-end justify-between">
            <span className={`text-3xl font-bold font-mono ${status.cpuLoad > 80 ? 'text-cyber-danger' : status.cpuLoad > 50 ? 'text-cyber-warning' : 'text-white'}`}>
              {Math.round(status.cpuLoad)}%
            </span>
            <div className="w-24 h-2 bg-gray-700 rounded-full mb-2">
              <div 
                className={`h-full rounded-full transition-all duration-200 ${status.cpuLoad > 80 ? 'bg-cyber-danger' : 'bg-cyber-accent'}`} 
                style={{ width: `${status.cpuLoad}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-cyber-panel border border-gray-700">
          <h3 className="text-gray-400 text-sm font-mono mb-1">TRAFFIC (RPS)</h3>
          <span className="text-3xl font-bold font-mono text-cyber-accent">
            {status.requestsPerSecond.toLocaleString()}
          </span>
          <span className="text-xs text-gray-500 ml-2">req/sec</span>
        </div>
      </div>

      {/* Chart */}
      <div className="col-span-1 lg:col-span-2 bg-cyber-panel rounded-lg border border-gray-700 p-4">
        <h3 className="text-gray-400 text-sm font-mono mb-4">LOAD HISTORY</h3>
        <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
                <defs>
                <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff003c" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ff003c" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#666" tick={{fontSize: 10}} tickMargin={10} />
                <YAxis stroke="#666" tick={{fontSize: 10}} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#13131f', borderColor: '#333', color: '#fff' }} 
                    itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="load" stroke="#ff003c" fillOpacity={1} fill="url(#colorLoad)" name="CPU Load" />
                <Area type="monotone" dataKey="rps" stroke="#00f0ff" fillOpacity={0.3} fill="url(#colorRps)" name="RPS (x10)" />
            </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel;
