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
  averageEarnings: number;
}

const TopThreePodium: React.FC = () => {
  const [topPlayers, setTopPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refreshTrigger } = useDashboard();

  useEffect(() => {
    const fetchTopPlayers = async () => {
      try {
        const response = await playerApi.getAll();
        // Sort players by totalEarnings in descending order and take top 3
        const sortedPlayers = response.data
          .sort((a: Player, b: Player) => b.totalEarnings - a.totalEarnings)
          .slice(0, 3);
        
        // If we have less than 3 players, pad the array with empty slots
        const paddedPlayers = [...sortedPlayers];
        while (paddedPlayers.length < 3) {
          paddedPlayers.push({
            _id: `empty-${paddedPlayers.length}`,
            name: 'No Player',
            totalEarnings: 0,
            matchesPlayed: 0,
            wins: 0,
            topThreeFinishes: 0,
            lastPlaceFinishes: 0,
            averageEarnings: 0
          });
        }
        
        setTopPlayers(paddedPlayers);
        setError(null);
      } catch (err) {
        setError('Failed to fetch top players');
        console.error('Error fetching top players:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopPlayers();
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

  const podiumHeights = ['h-32 md:h-40', 'h-24 md:h-32', 'h-20 md:h-24'];
  const positions = ['order-1', 'order-2', 'order-3'];
  const icons = [
    <Trophy size={32} className="text-[#E64833]" />,
    <Award size={32} className="text-[#FBE9D0]" />,
    <Medal size={32} className="text-[#E64833]" />
  ];

  return (
    <div className="flex justify-center items-end h-48 md:h-64 mb-8 md:mb-12 px-2">
      {topPlayers.map((player, index) => (
        <motion.div
          key={player._id}
          className={`${positions[index]} flex flex-col items-center mx-2 sm:mx-4 md:mx-8`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2, duration: 0.5 }}
        >
          <motion.div
            className="mb-2 md:mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.2 + 0.3, duration: 0.3, type: 'spring' }}
          >
            {icons[index]}
          </motion.div>
          <motion.div
            className={`w-24 md:w-32 ${podiumHeights[index]} rounded-t-lg p-2 md:p-4 flex flex-col items-center justify-center
              ${player._id.startsWith('empty') ? 'bg-[#244855]/50' : 'bg-[#244855]/90'} 
              backdrop-blur-sm border border-[#FBE9D0]/30
              shadow-[0_4px_12px_rgba(0,0,0,0.25)]`}
            whileHover={{ scale: 1.05 }}
          >
            <p className={`text-[#FBE9D0] font-bold text-sm md:text-lg mb-1 md:mb-2 text-center ${player._id.startsWith('empty') ? 'opacity-50' : ''}`}>
              {player.name}
            </p>
            <p className={`text-[#E64833] font-bold text-xs md:text-base ${player._id.startsWith('empty') ? 'opacity-50' : ''}`}>
              ₹{player.totalEarnings}
            </p>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

export default TopThreePodium;