import { motion } from 'framer-motion';
import { Coins, Target, TrendingDown, Trophy } from 'lucide-react';
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

const PlayerStats: React.FC = () => {
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
      } catch (error) {
        console.error('Error fetching players:', error);
        setError('Failed to fetch players');
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
      {players.map((player, index) => (
        <motion.div
          key={player._id}
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
                <span className="text-xs md:text-sm text-[#FBE9D0]">Top 3 Finishes</span>
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
                ₹{player.averageEarning.toFixed(2)}
              </span>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PlayerStats;