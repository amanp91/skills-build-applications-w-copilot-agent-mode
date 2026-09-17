import mongoose, { Schema, type Model } from 'mongoose';

const { model } = mongoose;

export interface IUser {
  username: string;
  email: string;
  fitnessLevel: string;
  team?: string;
}

export interface ITeam {
  name: string;
  description?: string;
  members: string[];
}

export interface IActivity {
  userId: string;
  type: string;
  durationMinutes: number;
  caloriesBurned: number;
  date: Date;
}

export interface ILeaderboardEntry {
  userId: string;
  username: string;
  totalPoints: number;
  rank: number;
  teamName?: string;
}

export interface IWorkout {
  title: string;
  category: string;
  difficulty: string;
  durationMinutes: number;
  description?: string;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    fitnessLevel: { type: String, required: true, default: 'beginner' },
    team: { type: String, trim: true },
  },
  { timestamps: true }
);

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, trim: true },
    members: { type: [String], default: [] },
  },
  { timestamps: true }
);

const activitySchema = new Schema<IActivity>(
  {
    userId: { type: String, required: true },
    type: { type: String, required: true },
    durationMinutes: { type: Number, required: true, min: 0 },
    caloriesBurned: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const leaderboardEntrySchema = new Schema<ILeaderboardEntry>(
  {
    userId: { type: String, required: true },
    username: { type: String, required: true },
    totalPoints: { type: Number, default: 0 },
    rank: { type: Number, default: 1 },
    teamName: { type: String },
  },
  { timestamps: true }
);

const workoutSchema = new Schema<IWorkout>(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    difficulty: { type: String, required: true, default: 'easy' },
    durationMinutes: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
  },
  { timestamps: true }
);

export const User: Model<IUser> = model<IUser>('User', userSchema);
export const Team: Model<ITeam> = model<ITeam>('Team', teamSchema);
export const Activity: Model<IActivity> = model<IActivity>('Activity', activitySchema);
export const LeaderboardEntry: Model<ILeaderboardEntry> = model<ILeaderboardEntry>(
  'LeaderboardEntry',
  leaderboardEntrySchema
);
export const Workout: Model<IWorkout> = model<IWorkout>('Workout', workoutSchema);

export default {
  User,
  Team,
  Activity,
  LeaderboardEntry,
  Workout,
};
