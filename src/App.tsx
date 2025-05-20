import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Leaderboard from './components/Leaderboard';
import PlayerStats from './components/PlayerStats';
import TopThreePodium from './components/TopThreePodium';
import { playerData as initialPlayerData } from './data/playerData';

function App() {
  const [playerData] = useState(initialPlayerData);

  return (
    <div 
      className="min-h-screen p-2 sm:p-4 md:p-8"
      style={{
        background: `
          linear-gradient(45deg, #244855 0%, #874F41 100%),
          url('https://www.transparenttextures.com/patterns/old-wall.png')
        `,
        backgroundBlendMode: 'soft-light',
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto space-y-8 md:space-y-12"
      >
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold text-center mb-8 md:mb-12 text-[#FBE9D0]"
          style={{
            fontFamily: "'Orbitron', sans-serif",
            textShadow: '0 2px 10px rgba(230, 72, 51, 0.3)',
          }}
        >
          Fantasy Cricket Dashboard
        </motion.h1>
        
        <TopThreePodium />

        <div className="grid grid-cols-1 gap-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Leaderboard players={playerData} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <PlayerStats />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default App;