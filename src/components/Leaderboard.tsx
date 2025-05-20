import { motion } from 'framer-motion';
import { Award, Medal, Trophy } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { playerApi } from '../services/api';

interface Player {
  _id: string;
  name: string;
  totalEarnings: number;
  matchesPlayed: number;
  wins: number;
  topThreeFinishes: number;
  lastPlaceFinishes: number;
  averageEarning: number;
}

const Leaderboard: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refreshTrigger } = useDashboard();

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await playerApi.getAll();
        setPlayers(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch players');
        console.error('Error fetching players:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E64833]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

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
              <th className="px-3 md:px-6 py-3 text-right text-xs font-medium text-[#FBE9D0] uppercase tracking-wider">
                Avg. Earnings
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FBE9D0]/30">
            {players.map((player, index) => (
              <motion.tr 
                key={player._id}
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
                <td className="px-3 md:px-6 py-3 md:py-4 whitespace-nowrap text-right">
                  <motion.span 
                    className={`inline-flex items-center px-2 md:px-3 py-0.5 rounded-full text-xs md:text-sm font-medium ${
                      player.averageEarning > 0 
                        ? 'bg-[#E64833]/20 text-[#FBE9D0]' 
                        : 'bg-[#874F41]/40 text-[#FBE9D0]'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    ₹{player.averageEarning.toFixed(2)}
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