import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, TrendingDown, Coins } from 'lucide-react';
import { getPlayerStats } from '../data/playerData';

const PlayerStats: React.FC = () => {
  const playerStats = getPlayerStats();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
      {playerStats.map((player, index) => (
        <motion.div
          key={player.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-[#244855]/80 backdrop-blur-lg rounded-xl shadow-xl p-4 md:p-6 border border-[#FBE9D0]/30"
        >
          <h3 className="text-lg md:text-xl font-bold text-[#FBE9D0] mb-4">
            {player.name}
          </h3>
          
          <div className="space-y-3 md:space-y-4">
            <motion.div 
              className="flex items-center justify-between"
              whileHover={{ x: 5 }}
            >
              <div className="flex items-center text-[#E64833]">
                <Trophy size={16} className="mr-2" />
                <span className="text-xs md:text-sm text-[#FBE9D0]">Wins</span>
              </div>
              <span className="font-semibold text-[#E64833]">{player.wins}</span>
            </motion.div>

            <motion.div 
              className="flex items-center justify-between"
              whileHover={{ x: 5 }}
            >
              <div className="flex items-center text-[#FBE9D0]">
                <Target size={16} className="mr-2" />
                <span className="text-xs md:text-sm text-[#FBE9D0]">Top 4 Finishes</span>
              </div>
              <span className="font-semibold text-[#FBE9D0]">{player.topThreeFinishes}</span>
            </motion.div>

            <motion.div 
              className="flex items-center justify-between"
              whileHover={{ x: 5 }}
            >
              <div className="flex items-center text-[#E64833]">
                <TrendingDown size={16} className="mr-2" />
                <span className="text-xs md:text-sm text-[#FBE9D0]">Last Places</span>
              </div>
              <span className="font-semibold text-[#E64833]">{player.lastPlaceFinishes}</span>
            </motion.div>

            <motion.div 
              className="flex items-center justify-between"
              whileHover={{ x: 5 }}
            >
              <div className="flex items-center text-[#FBE9D0]">
                <Coins size={16} className="mr-2" />
                <span className="text-xs md:text-sm text-[#FBE9D0]">Avg. Earnings</span>
              </div>
              <span className={`font-semibold ${player.averageEarning >= 0 ? 'text-[#E64833]' : 'text-[#874F41]'}`}>
                ₹{player.averageEarning}
              </span>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PlayerStats;