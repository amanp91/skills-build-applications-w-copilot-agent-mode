import mongoose from 'mongoose';
import {
  Activity,
  LeaderboardEntry,
  Team,
  User,
  Workout,
} from '../models/index.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

async function seedDatabase() {
  try {
    console.log('Seed the octofit_db database with test data');
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      LeaderboardEntry.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.insertMany([
      { username: 'alice', email: 'alice@example.com', fitnessLevel: 'intermediate', team: 'Rocket Runners' },
      { username: 'ben', email: 'ben@example.com', fitnessLevel: 'advanced', team: 'Rocket Runners' },
      { username: 'carla', email: 'carla@example.com', fitnessLevel: 'beginner', team: 'Trail Blazers' },
      { username: 'dante', email: 'dante@example.com', fitnessLevel: 'intermediate', team: 'Trail Blazers' },
    ]);

    const teams = await Team.insertMany([
      {
        name: 'Rocket Runners',
        description: 'Fast-paced endurance athletes',
        members: users.slice(0, 2).map((user) => user.username),
      },
      {
        name: 'Trail Blazers',
        description: 'Outdoor adventure and mobility focus',
        members: users.slice(2).map((user) => user.username),
      },
    ]);

    const activities = await Activity.insertMany([
      {
        userId: users[0]._id.toString(),
        type: 'run',
        durationMinutes: 35,
        caloriesBurned: 320,
        date: new Date('2026-09-17T05:00:00.000Z'),
      },
      {
        userId: users[1]._id.toString(),
        type: 'strength',
        durationMinutes: 45,
        caloriesBurned: 410,
        date: new Date('2026-09-16T18:30:00.000Z'),
      },
      {
        userId: users[2]._id.toString(),
        type: 'walk',
        durationMinutes: 50,
        caloriesBurned: 180,
        date: new Date('2026-09-15T08:15:00.000Z'),
      },
    ]);

    const leaderboard = await LeaderboardEntry.insertMany([
      {
        userId: users[0]._id.toString(),
        username: users[0].username,
        totalPoints: 1240,
        rank: 1,
        teamName: teams[0].name,
      },
      {
        userId: users[1]._id.toString(),
        username: users[1].username,
        totalPoints: 980,
        rank: 2,
        teamName: teams[0].name,
      },
      {
        userId: users[2]._id.toString(),
        username: users[2].username,
        totalPoints: 920,
        rank: 3,
        teamName: teams[1].name,
      },
      {
        userId: users[3]._id.toString(),
        username: users[3].username,
        totalPoints: 860,
        rank: 4,
        teamName: teams[1].name,
      },
    ]);

    const workouts = await Workout.insertMany([
      {
        title: 'Hill Intervals',
        category: 'cardio',
        difficulty: 'moderate',
        durationMinutes: 30,
        description: 'Sprint up a hill and recover on the descent.',
      },
      {
        title: 'Core Circuit',
        category: 'strength',
        difficulty: 'easy',
        durationMinutes: 25,
        description: 'Planks, crunches, and mountain climbers.',
      },
      {
        title: 'Mobility Flow',
        category: 'recovery',
        difficulty: 'easy',
        durationMinutes: 20,
        description: 'Hip, shoulder, and ankle mobility practice.',
      },
    ]);

    console.log('Database seeding complete', {
      users: users.length,
      teams: teams.length,
      activities: activities.length,
      leaderboard: leaderboard.length,
      workouts: workouts.length,
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
