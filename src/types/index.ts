export interface PlayerData {
  name: string;
  totalEarnings: number;
  matches: {
    matchId: string;
    earnings: number;
  }[];
}

export interface MatchData {
  id: string;
  name: string;
  participants: number;
  distribution: string;
  didNotJoin: string[];
  lastPlace: string;
}

export interface PlayerStats {
  name: string;
  wins: number;
  topThreeFinishes: number;
  lastPlaceFinishes: number;
  missedMatches: number;
  highestEarning: number;
  lowestEarning: number;
  averageEarning: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    borderWidth?: number;
    fill?: boolean;
  }[];
}