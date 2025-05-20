import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, X, Plus } from 'lucide-react';

interface AddMatchFormProps {
  onAddMatch: (winners: { name: string; earnings: number }[]) => void;
  players: string[];
}

const AddMatchForm: React.FC<AddMatchFormProps> = ({ onAddMatch, players }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [winners, setWinners] = useState<{ name: string; earnings: number }[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddMatch(winners);
    setWinners([]);
    setIsOpen(false);
  };

  const addWinner = () => {
    setWinners([...winners, { name: players[0], earnings: 0 }]);
  };

  const removeWinner = (index: number) => {
    setWinners(winners.filter((_, i) => i !== index));
  };

  const updateWinner = (index: number, field: 'name' | 'earnings', value: string | number) => {
    const newWinners = [...winners];
    newWinners[index] = { ...newWinners[index], [field]: value };
    setWinners(newWinners);
  };

  return (
    <div className="fixed bottom-8 right-8">
      {!isOpen ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-4 rounded-full shadow-lg flex items-center space-x-2"
        >
          <Plus size={24} />
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-white/20 w-96"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Trophy className="mr-2" size={24} />
              Add Match Results
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {winners.map((winner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex space-x-2"
              >
                <select
                  value={winner.name}
                  onChange={(e) => updateWinner(index, 'name', e.target.value)}
                  className="flex-1 bg-purple-900/50 border border-purple-500/30 rounded-lg px-3 py-2 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500"
                  style={{ color: 'white' }}
                >
                  {players.map((player) => (
                    <option 
                      key={player} 
                      value={player}
                      className="bg-purple-900 text-white"
                    >
                      {player}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  value={winner.earnings}
                  onChange={(e) => updateWinner(index, 'earnings', parseInt(e.target.value))}
                  placeholder="Earnings"
                  className="w-24 bg-purple-900/50 border border-purple-500/30 rounded-lg px-3 py-2 text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => removeWinner(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={20} />
                </button>
              </motion.div>
            ))}

            <div className="flex space-x-2">
              <motion.button
                type="button"
                onClick={addWinner}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-purple-900/50 hover:bg-purple-800/50 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 border border-purple-500/30"
              >
                <Plus size={20} />
                <span>Add Winner</span>
              </motion.button>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg"
            >
              Save Match Results
            </motion.button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default AddMatchForm;