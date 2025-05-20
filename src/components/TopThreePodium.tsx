import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Medal } from 'lucide-react';

const TopThreePodium: React.FC = () => {
  const topThree = [
    { name: 'Shubham', totalEarnings: 304, position: 2 },
    { name: 'Bharath', totalEarnings: 311, position: 1 },
    { name: 'Ravi Teja N', totalEarnings: 205, position: 3 }
  ];

  const podiumHeights = ['h-24 md:h-32', 'h-32 md:h-40', 'h-20 md:h-24'];
  const positions = ['order-2', 'order-1', 'order-3'];
  const icons = [
    <Award size={32} className="text-[#FBE9D0]" />,
    <Trophy size={32} className="text-[#E64833]" />,
    <Medal size={32} className="text-[#E64833]" />
  ];

  return (
    <div className="flex justify-center items-end h-48 md:h-64 mb-8 md:mb-12 px-2">
      {topThree.map((player, index) => (
        <motion.div
          key={player.name}
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
              bg-[#244855]/90 backdrop-blur-sm border border-[#FBE9D0]/30
              shadow-[0_4px_12px_rgba(0,0,0,0.25)]`}
            whileHover={{ scale: 1.05 }}
          >
            <p className="text-[#FBE9D0] font-bold text-sm md:text-lg mb-1 md:mb-2 text-center">{player.name}</p>
            <p className="text-[#E64833] font-bold text-xs md:text-base">₹{player.totalEarnings}</p>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

export default TopThreePodium;