import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { getRunningTotals } from '../data/playerData';

const PerformanceChart: React.FC = () => {
  const runningTotals = getRunningTotals();
  const players = Object.keys(runningTotals);
  const matchCount = runningTotals[players[0]].length;
  const labels = Array.from({ length: matchCount }, (_, i) => `Match ${i + 5}`);

  const maxValue = Math.max(...Object.values(runningTotals).flat());
  const minValue = Math.min(...Object.values(runningTotals).flat());
  const range = maxValue - minValue;
  const height = 200;
  const width = matchCount * 10;

  const getPath = (values: number[]) => {
    return values.map((value, index) => {
      const x = (index / (matchCount - 1)) * width;
      const y = height - ((value - minValue) / range) * height;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/10 backdrop-blur-lg rounded-xl shadow-xl p-6 border border-white/20"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 flex items-center">
          <LineChart className="mr-2" size={24} /> Performance Trends
        </h2>
        <div className="flex space-x-4">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <TrendingUp className="text-emerald-300 mr-1" size={16} />
            <span className="text-sm text-white">Trending Up</span>
          </motion.div>
        </div>
      </div>
      
      <div className="relative h-[300px] w-full overflow-x-auto">
        <svg
          className="w-full h-full min-w-[800px]"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.line
              key={`grid-${i}`}
              x1="0"
              y1={i * (height / 4)}
              x2={width}
              y2={i * (height / 4)}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: i * 0.1 }}
            />
          ))}

          {/* Player lines */}
          {Object.entries(runningTotals).map(([player, values], index) => (
            <motion.path
              key={player}
              d={getPath(values)}
              fill="none"
              stroke={`hsl(${(index * 360) / players.length}, 90%, 70%)`}
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
            />
          ))}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-wrap gap-4 p-4 bg-black/30 backdrop-blur-sm rounded-b-xl">
          {players.map((player, index) => {
            const values = runningTotals[player];
            const isPositive = values[values.length - 1] > 0;
            return (
              <motion.div
                key={player}
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: `hsl(${(index * 360) / players.length}, 90%, 70%)` }}
                />
                <span className="text-sm font-medium text-white">{player}</span>
                {isPositive ? (
                  <ArrowUpRight className="text-emerald-300" size={16} />
                ) : (
                  <ArrowDownRight className="text-red-300" size={16} />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default PerformanceChart;