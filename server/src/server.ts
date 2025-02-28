import express from 'express';
import path from 'node:path';
import db from './config/connection.js'; // ✅ Ensure the correct import

// Import Apollo Server (Apollo v4)
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

// Import authentication
import { authenticateToken } from './services/auth.js';

// Import GraphQL schema
import { typeDefs, resolvers } from './schemas/index.js';

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();

  // Wait for MongoDB to establish connection properly
  db.once('open', () => {
    console.log('📦 Successfully connected to MongoDB');
  });

  const PORT = process.env.PORT || 3001;
  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Apply `expressMiddleware` correctly with proper typing
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => authenticateToken({ req }),
    }) as unknown as express.RequestHandler
  );

  // Serve static assets in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  // Start the server AFTER the database is connected
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 GraphQL available at http://localhost:${PORT}/graphql`);
  });
};

// Start the Apollo Server
startApolloServer();






