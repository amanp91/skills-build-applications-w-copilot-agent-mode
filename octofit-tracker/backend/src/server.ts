import express, { type Request, type Response, type NextFunction } from 'express';
import { connectDatabase } from './config/database.js';
import {
  Activity,
  LeaderboardEntry,
  Team,
  User,
  Workout,
} from './models/index.js';

const app = express();
const port = Number(process.env.PORT) || 8000;
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(express.json());

const sendError = (response: Response, error: unknown, statusCode = 500) => {
  const message = error instanceof Error ? error.message : 'An unexpected error occurred';
  response.status(statusCode).json({ error: message });
};

app.get('/api/health', (_request, response) => {
  response.json({
    status: 'ok',
    service: 'octofit-tracker-api',
    apiBaseUrl,
  });
});

app
  .route('/api/users')
  .get(async (_request, response) => {
    try {
      const users = await User.find().lean();
      response.json(users);
    } catch (error) {
      sendError(response, error);
    }
  })
  .post(async (request, response) => {
    try {
      const user = await User.create(request.body);
      response.status(201).json(user);
    } catch (error) {
      sendError(response, error, 400);
    }
  });

app
  .route('/api/teams')
  .get(async (_request, response) => {
    try {
      const teams = await Team.find().lean();
      response.json(teams);
    } catch (error) {
      sendError(response, error);
    }
  })
  .post(async (request, response) => {
    try {
      const team = await Team.create(request.body);
      response.status(201).json(team);
    } catch (error) {
      sendError(response, error, 400);
    }
  });

app
  .route('/api/activities')
  .get(async (_request, response) => {
    try {
      const activities = await Activity.find().sort({ date: -1 }).lean();
      response.json(activities);
    } catch (error) {
      sendError(response, error);
    }
  })
  .post(async (request, response) => {
    try {
      const activity = await Activity.create(request.body);
      response.status(201).json(activity);
    } catch (error) {
      sendError(response, error, 400);
    }
  });

app
  .route('/api/leaderboard')
  .get(async (_request, response) => {
    try {
      const leaderboard = await LeaderboardEntry.find().sort({ totalPoints: -1, rank: 1 }).lean();
      response.json(leaderboard);
    } catch (error) {
      sendError(response, error);
    }
  })
  .post(async (request, response) => {
    try {
      const entry = await LeaderboardEntry.create(request.body);
      response.status(201).json(entry);
    } catch (error) {
      sendError(response, error, 400);
    }
  });

app
  .route('/api/workouts')
  .get(async (_request, response) => {
    try {
      const workouts = await Workout.find().lean();
      response.json(workouts);
    } catch (error) {
      sendError(response, error);
    }
  })
  .post(async (request, response) => {
    try {
      const workout = await Workout.create(request.body);
      response.status(201).json(workout);
    } catch (error) {
      sendError(response, error, 400);
    }
  });

app.use((error: Error, _request: Request, response: Response, _next: NextFunction) => {
  console.error(error);
  response.status(500).json({ error: error.message });
});

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`OctoFit Tracker API listening on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start the API server:', error);
    process.exit(1);
  }
};

startServer();
