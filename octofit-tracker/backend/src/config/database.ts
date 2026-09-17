import mongoose from 'mongoose';

export const getApiBaseUrl = (): string => {
  const codespaceName = process.env.CODESPACE_NAME;
  return codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : 'http://localhost:8000';
};

export const connectDatabase = async () => {
  const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

  mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error);
  });

  await mongoose.connect(connectionString);

  console.log(
    `Connected to MongoDB: ${mongoose.connection.host}:${mongoose.connection.port}/${mongoose.connection.name}`
  );

  return mongoose.connection;
};

export default mongoose.connection;
