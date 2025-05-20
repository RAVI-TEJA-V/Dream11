import { motion } from 'framer-motion';
import { Lock, Plus, Trophy, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useDashboard } from '../context/DashboardContext';
import { matchApi, playerApi } from '../services/api';

interface Player {
  _id: string;
  name: string;
}

interface Winner {
  playerId: string;
  earnings: number;
}

const PASSKEY = 'Bits@123';

const AddMatchForm: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [passkeyError, setPasskeyError] = useState<string | null>(null);
  const { triggerRefresh } = useDashboard();

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
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowPasskeyModal(true);
  };

  const verifyAndSubmit = async () => {
    if (passkey !== PASSKEY) {
      setPasskeyError('Invalid passkey');
      toast.error('Invalid passkey! Please try again.', {
        style: {
          background: '#244855',
          color: '#FBE9D0',
          border: '1px solid #E64833',
        },
        iconTheme: {
          primary: '#E64833',
          secondary: '#FBE9D0',
        },
      });
      return;
    }

    setLoading(true);
    try {
      await matchApi.create(winners);
      setWinners([]);
      setIsOpen(false);
      setShowPasskeyModal(false);
      setPasskey('');
      setPasskeyError(null);
      triggerRefresh();
      toast.success('Match results saved successfully! 🎉', {
        style: {
          background: '#244855',
          color: '#FBE9D0',
          border: '1px solid #E64833',
        },
        iconTheme: {
          primary: '#E64833',
          secondary: '#FBE9D0',
        },
      });
    } catch (error) {
      console.error('Error creating match:', error);
      setError('Failed to add match');
      toast.error('Failed to save match results. Please try again.', {
        style: {
          background: '#244855',
          color: '#FBE9D0',
          border: '1px solid #E64833',
        },
        iconTheme: {
          primary: '#E64833',
          secondary: '#FBE9D0',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const addAllPlayers = () => {
    const newWinners = players.map(player => ({
      playerId: player._id,
      earnings: 0
    }));
    setWinners(newWinners);
  };

  const removeWinner = (index: number) => {
    setWinners(winners.filter((_, i) => i !== index));
  };

  const updateWinner = (index: number, field: 'playerId' | 'earnings', value: string | number) => {
    const newWinners = [...winners];
    newWinners[index] = { ...newWinners[index], [field]: value };
    setWinners(newWinners);
  };

  if (loading) {
    return null;
  }

  if (error) {
    return (
      <div className="fixed bottom-8 right-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="fixed bottom-8 right-8">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#244855',
            color: '#FBE9D0',
            border: '1px solid #E64833',
          },
        }}
      />
      {!isOpen ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-[#E64833] to-[#874F41] text-white p-4 rounded-full shadow-lg flex items-center space-x-2 hover:shadow-xl transition-all duration-300"
        >
          <Plus size={24} />
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#244855]/95 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-[#FBE9D0]/20 w-96"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#FBE9D0] flex items-center">
              <Trophy className="mr-2" size={24} />
              Add Match Results
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#FBE9D0]/60 hover:text-[#FBE9D0] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3 custom-scrollbar">
              {winners.map((winner, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex space-x-2 bg-[#244855]/50 p-2 rounded-lg border border-[#FBE9D0]/10"
                >
                  <select
                    value={winner.playerId}
                    onChange={(e) => updateWinner(index, 'playerId', e.target.value)}
                    className="flex-1 bg-[#244855] border border-[#FBE9D0]/20 rounded-lg px-3 py-2 text-[#FBE9D0] placeholder-[#FBE9D0]/50 focus:outline-none focus:border-[#E64833]"
                  >
                    {players.map((player) => (
                      <option 
                        key={player._id} 
                        value={player._id}
                        className="bg-[#244855] text-[#FBE9D0]"
                      >
                        {player.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={winner.earnings}
                    onChange={(e) => updateWinner(index, 'earnings', parseInt(e.target.value))}
                    placeholder="Earnings"
                    className="w-24 bg-[#244855] border border-[#FBE9D0]/20 rounded-lg px-3 py-2 text-[#FBE9D0] placeholder-[#FBE9D0]/50 focus:outline-none focus:border-[#E64833]"
                  />
                  <button
                    type="button"
                    onClick={() => removeWinner(index)}
                    className="text-[#E64833] hover:text-[#E64833]/80 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="flex space-x-2 pt-2">
              <motion.button
                type="button"
                onClick={addAllPlayers}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-[#244855] hover:bg-[#244855]/80 text-[#FBE9D0] px-4 py-2 rounded-lg flex items-center justify-center space-x-2 border border-[#FBE9D0]/20 transition-colors"
              >
                <Plus size={20} />
                <span>Add All Players</span>
              </motion.button>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#E64833] to-[#874F41] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              Save Match Results
            </motion.button>
          </form>

          {/* Passkey Modal */}
          {showPasskeyModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#244855] p-6 rounded-xl shadow-xl border border-[#FBE9D0]/20 w-96"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#FBE9D0] flex items-center">
                    <Lock className="mr-2" size={24} />
                    Enter Passkey
                  </h3>
                  <button
                    onClick={() => {
                      setShowPasskeyModal(false);
                      setPasskey('');
                      setPasskeyError(null);
                    }}
                    className="text-[#FBE9D0]/60 hover:text-[#FBE9D0] transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <input
                    type="password"
                    value={passkey}
                    onChange={(e) => {
                      setPasskey(e.target.value);
                      setPasskeyError(null);
                    }}
                    placeholder="Enter passkey"
                    className="w-full bg-[#244855] border border-[#FBE9D0]/20 rounded-lg px-3 py-2 text-[#FBE9D0] placeholder-[#FBE9D0]/50 focus:outline-none focus:border-[#E64833]"
                  />
                  {passkeyError && (
                    <p className="text-[#E64833] text-sm">{passkeyError}</p>
                  )}
                  <div className="flex space-x-2">
                    <motion.button
                      onClick={() => {
                        setShowPasskeyModal(false);
                        setPasskey('');
                        setPasskeyError(null);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-[#244855] hover:bg-[#244855]/80 text-[#FBE9D0] px-4 py-2 rounded-lg border border-[#FBE9D0]/20 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      onClick={verifyAndSubmit}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-gradient-to-r from-[#E64833] to-[#874F41] text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
                    >
                      Verify & Save
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AddMatchForm;