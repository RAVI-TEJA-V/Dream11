import { PlayerData, PlayerStats, MatchData } from '../types';

// Raw data from the spreadsheet
const rawData = [
  { name: 'Bharath', totalEarnings: 311, matchData: [0, -20, 60, 0, 16, -20, -20, -20, -20, -20, 45, -20, -20, -20, 25, -20, 40, -40, -20, -20, 25, 45, 65, -20, 25, 45, -20, -20, 65, -20, 25, -20, 20, 45, -20, -20, 65, 25, -20, 0, 40, 65, -20, 45, -20, 50, 45, -20, 45, 5, 0, -20, -20, 0, 0, -40, -20, -20] },
  { name: 'Shubham', totalEarnings: 304, matchData: [0, 60, 20, 60, 34, 20, 60, -20, 65, -20, -20, -40, -20, -20, -20, 45, -20, 5, 5, -20, 45, 25, -20, -20, -20, -30, 45, -20, 45, -20, -20, 45, 80, -20, 5, -20, -20, -20, 5, 0, -30, -20, 25, 5, 25, 0, 25, -20, 65, 25, 0, -20, 65, 0, 0, -20, -40, -20] },
  { name: 'Ravi Teja N', totalEarnings: 205, matchData: [-20, 40, -20, -20, 70, -20, -20, 20, -40, -20, 65, 5, 45, -20, 65, 65, 0, -20, 65, -20, -20, -20, -20, -40, -20, -20, 25, 45, -40, 5, -40, 25, 0, -20, 45, 65, -20, 65, -20, 0, 0, 25, 45, -20, 45, 0, 5, -40, -20, 65, 0, -40, -20, 0, 0, 5, -20, -40] },
  { name: 'Sumanth', totalEarnings: 180, matchData: [0, -20, -20, -20, 0, -20, -20, 0, -20, -20, -20, -20, -20, -20, 5, 25, 80, -20, 45, 45, -20, 5, 15, 5, 65, -30, 65, -20, 5, 45, 45, -20, 40, 65, -40, -20, -20, 45, 65, 0, -30, 5, -20, 25, -40, 20, -40, -20, -40, -30, 0, 45, -20, 0, 0, -20, 45, 45] },
  { name: 'Shashi', totalEarnings: 73, matchData: [8, -20, 40, -20, -20, 40, 20, -20, -20, 65, -20, 25, -20, 5, -40, -20, -20, 65, -20, 65, 65, -40, -20, 65, -20, 65, -20, 65, -20, -20, -20, 65, -20, -20, -20, -20, -40, 5, 45, 0, -20, -20, -20, 65, -20, -20, -20, -20, -20, -20, 0, 15, 45, 0, 0, -20, -20, -20] },
  { name: 'Praneeth', totalEarnings: -2, matchData: [-20, 20, 0, -20, -20, -20, -20, -20, 25, -40, -20, -20, 65, 45, -20, -40, -20, 45, -40, 5, -40, 65, 15, 25, 45, 5, 5, -20, -20, 65, 65, -20, -20, -20, -20, -40, 45, -20, -27, 0, 0, -20, -40, -20, 65, -20, -20, 45, -20, -20, 0, -20, -20, 0, 0, 65, 25, 25] },
  { name: 'Bhuvan', totalEarnings: -110, matchData: [50, 0, -20, -20, -20, -20, 0, 60, 5, 5, 25, 45, 5, -20, -20, -20, -40, -20, -20, -40, -20, -20, 45, -20, 5, 25, -20, 5, -20, -20, -20, -40, -20, 25, 65, -20, -20, -20, 25, 0, -20, -20, 65, -40, -20, -20, -20, 25, -20, -20, 0, 15, 5, 0, 0, 45, 65, -20] },
  { name: 'Raghu', totalEarnings: -155, matchData: [-20, -20, -20, 30, -20, 60, 40, -20, -20, 35, 5, 65, 25, -40, -20, 5, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, -20, 25, 25, -40, -20, 5, -20, 5, -20, 45, 25, -20, -20, 0, 20, -20, -20, -20, 5, -40, -20, 5, 5, 45, 0, -20, 25, 0, 0, -20, -20, 65] },
  { name: 'Phani', totalEarnings: -365, matchData: [22, -20, -20, -20, -20, -20, -20, -20, 45, 35, -20, -20, -20, 25, 45, -20, 20, -20, 25, 25, -20, -20, -20, -20, -40, -20, -20, -20, -20, 25, -20, -20, -20, -40, -20, 5, 5, -40, -27, 0, -20, -40, 5, -20, -20, 50, 65, 65, -20, -30, 0, -20, -40, 0, 0, 25, 5, -20] },
  { name: 'Kedar', totalEarnings: -441, matchData: [-20, -20, -20, 30, -20, 0, -20, 40, -20, -20, -40, -20, -40, 65, -20, -20, -20, 25, -20, -20, 5, -20, -40, 45, -20, -20, -40, -40, -20, -20, 5, -20, -40, -20, 25, 25, -20, -20, -26, 0, 60, 45, -20, -20, -20, -20, -20, -20, 25, -20, 0, 65, -20, 0, 0, -20, -20, 5] }
];

// Convert raw data to structured PlayerData
export const playerData: PlayerData[] = rawData.map(player => {
  return {
    name: player.name,
    totalEarnings: player.totalEarnings,
    matches: player.matchData.map((earnings, index) => {
      return {
        matchId: `Match ${index + 5}`,
        earnings
      };
    })
  };
});

// Generate player statistics
export const getPlayerStats = (): PlayerStats[] => {
  return playerData.map(player => {
    const matchEarnings = player.matches.map(m => m.earnings);
    
    return {
      name: player.name,
      wins: matchEarnings.filter(e => e >= 50).length, // Updated to count wins as earnings >= 50
      topThreeFinishes: matchEarnings.filter(e => e > 0).length,
      lastPlaceFinishes: matchEarnings.filter(e => e <= -40).length,
      missedMatches: matchEarnings.filter(e => e === -20).length,
      highestEarning: Math.max(...matchEarnings),
      lowestEarning: Math.min(...matchEarnings),
      averageEarning: parseFloat((matchEarnings.reduce((a, b) => a + b, 0) / matchEarnings.length).toFixed(2))
    };
  });
};

// Generate sample match data
export const getMatchData = (): MatchData[] => {
  const matchNames = [
    'GT vs PBKS', 'RR vs KKR', 'SRH vs LSG', 'CSK vs RCB', 'GT vs MI',
    'DC vs SRH', 'RR vs CSK', 'MI vs KKR', 'LSG vs PBKS', 'RCB vs GT'
  ];
  
  return Array.from({ length: 10 }).map((_, i) => {
    const participants = 10 - (i % 3 === 0 ? 1 : 0);
    const distribution = participants <= 3 ? (participants === 2 ? '100:0' : '80:20') 
      : participants <= 7 ? '50:30:20' 
      : participants <= 10 ? '40:30:20:10' 
      : '40:30:20:5:5';
      
    return {
      id: `Match ${i + 5}`,
      name: matchNames[i % matchNames.length],
      participants,
      distribution,
      didNotJoin: i % 3 === 0 ? ['Player ' + (i % 10 + 1)] : [],
      lastPlace: `Player ${(i + 3) % 10 + 1}`
    };
  });
};

// Get running totals for each player
export const getRunningTotals = (): {[key: string]: number[]} => {
  const result: {[key: string]: number[]} = {};
  
  playerData.forEach(player => {
    let runningTotal = 0;
    result[player.name] = player.matches.map(match => {
      runningTotal += match.earnings;
      return runningTotal;
    });
  });
  
  return result;
};

// Sort players by total earnings
export const getSortedPlayers = (): PlayerData[] => {
  return [...playerData].sort((a, b) => b.totalEarnings - a.totalEarnings);
};