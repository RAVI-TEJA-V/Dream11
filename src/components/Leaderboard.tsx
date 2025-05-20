import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Medal } from 'lucide-react';
import { PlayerData } from '../types';

interface LeaderboardProps {
  players: PlayerData[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players }) => {
  const sortedPlayers = [...players].sort((a, b) => b.totalEarnings - a.totalEarnings);

  return (
    <motion.div 
      className="bg-[#244855]/80 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden border border-[#FBE9D0]/30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-[#874F41] p-4">
        <h2 className="text-lg md:text-xl font-bold text-[#FBE9D0] flex items-center">
          <Trophy className="mr-2" size={24} /> Leaderboard
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#FBE9D0]/30">
          <thead className="bg-[#874F41]/20">
            <tr>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-[#FBE9D0] uppercase tracking-wider">
                Rank
              </th>
              <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-[#FBE9D0] uppercase tracking-wider">
                Player
              </th>
              <th className="px-3 md:px-6 py-3 text-right text-xs font-medium text-[#FBE9D0] uppercase tracking-wider">
                Total Earnings
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FBE9D0]/30">
            {sortedPlayers.map((player, index) => (
              <motion.tr 
                key={player.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="hover:bg-[#874F41]/10 transition-colors"
              >
                <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {index === 0 && <Trophy size={16} className="text-[#E64833] mr-1" />}
                    {index === 1 && <Award size={16} className="text-[#FBE9D0] mr-1" />}
                    {index === 2 && <Medal size={16} className="text-[#E64833] mr-1" />}
                    <span className={`font-medium ${index < 3 ? 'text-[#FBE9D0]' : 'text-[#FBE9D0]/80'}`}>
                      {index + 1}
                    </span>
                  </div>
                </td>
                <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap">
                  <div className="text-xs md:text-sm font-medium text-[#FBE9D0]">{player.name}</div>
                </td>
                <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-right">
                  <motion.span 
                    className={`inline-flex items-center px-2 md:px-3 py-0.5 rounded-full text-xs md:text-sm font-medium ${
                      player.totalEarnings > 0 
                        ? 'bg-[#E64833]/20 text-[#FBE9D0]' 
                        : 'bg-[#874F41]/40 text-[#FBE9D0]'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    ₹{player.totalEarnings}
                  </motion.span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Leaderboard;