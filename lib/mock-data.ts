// Mock data storage - in a real app, this would be a database
export interface User {
  id: string;
  email: string;
  name: string;
  age?: number;
  weight?: number;
  height?: number;
  goals: string[];
  preferences: {
    activityTypes: string[];
    notifications: boolean;
  };
  createdAt: string;
}

export interface Activity {
  id: string;
  userId: string;
  type: string;
  duration: number; // minutes
  calories?: number;
  distance?: number; // km
  steps?: number;
  heartRate?: number;
  date: string;
  createdAt: string;
}

export interface GamificationData {
  userId: string;
  xp: number;
  level: number;
  points: number;
  badges: string[];
  challenges: {
    id: string;
    name: string;
    progress: number;
    target: number;
    completed: boolean;
  }[];
}

export interface SocialData {
  userId: string;
  friends: string[];
  teams: {
    id: string;
    name: string;
    members: string[];
  }[];
  leaderboardRank: number;
  totalScore: number;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  score: number;
  rank: number;
  avatar?: string;
}

// In-memory storage
let users: User[] = [];
let activities: Activity[] = [];
let gamificationData: Record<string, GamificationData> = {};
let socialData: Record<string, SocialData> = {};
let leaderboard: LeaderboardEntry[] = [];

export const mockData = {
  users,
  activities,
  gamificationData,
  socialData,
  leaderboard,
};

// Helper functions
export function getUserById(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email === email);
}

export function createUser(user: Omit<User, "id" | "createdAt">): User {
  const newUser: User = {
    ...user,
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  
  // Initialize gamification data
  gamificationData[newUser.id] = {
    userId: newUser.id,
    xp: 0,
    level: 1,
    points: 0,
    badges: [],
    challenges: [],
  };
  
  // Initialize social data
  socialData[newUser.id] = {
    userId: newUser.id,
    friends: [],
    teams: [],
    leaderboardRank: users.length,
    totalScore: 0,
  };
  
  return newUser;
}

export function addActivity(activity: Omit<Activity, "id" | "createdAt">): Activity {
  const newActivity: Activity = {
    ...activity,
    id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
  };
  activities.push(newActivity);
  return newActivity;
}

export function getActivitiesByUserId(userId: string): Activity[] {
  return activities.filter((a) => a.userId === userId);
}

export function updateGamificationData(
  userId: string,
  updates: Partial<GamificationData>
): GamificationData {
  if (!gamificationData[userId]) {
    gamificationData[userId] = {
      userId,
      xp: 0,
      level: 1,
      points: 0,
      badges: [],
      challenges: [],
    };
  }
  gamificationData[userId] = { ...gamificationData[userId], ...updates };
  return gamificationData[userId];
}

export function getGamificationData(userId: string): GamificationData {
  if (!gamificationData[userId]) {
    gamificationData[userId] = {
      userId,
      xp: 0,
      level: 1,
      points: 0,
      badges: [],
      challenges: [],
    };
  }
  return gamificationData[userId];
}

export function updateSocialData(
  userId: string,
  updates: Partial<SocialData>
): SocialData {
  if (!socialData[userId]) {
    socialData[userId] = {
      userId,
      friends: [],
      teams: [],
      leaderboardRank: 0,
      totalScore: 0,
    };
  }
  socialData[userId] = { ...socialData[userId], ...updates };
  return socialData[userId];
}

export function getSocialData(userId: string): SocialData {
  if (!socialData[userId]) {
    socialData[userId] = {
      userId,
      friends: [],
      teams: [],
      leaderboardRank: 0,
      totalScore: 0,
    };
  }
  return socialData[userId];
}

export function updateLeaderboard(): LeaderboardEntry[] {
  const entries: LeaderboardEntry[] = users.map((user) => {
    const social = getSocialData(user.id);
    return {
      userId: user.id,
      userName: user.name,
      score: social.totalScore,
      rank: 0, // Will be set after sorting
    };
  });
  
  entries.sort((a, b) => b.score - a.score);
  entries.forEach((entry, index) => {
    entry.rank = index + 1;
  });
  
  leaderboard = entries;
  return leaderboard;
}

export function getLeaderboard(): LeaderboardEntry[] {
  return updateLeaderboard();
}

