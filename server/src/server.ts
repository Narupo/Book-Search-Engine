import express from 'express';
import path from 'node:path';
import type { Request, Response } from 'express';
import db from './config/connection';

// Import Apollo Server (newer version)
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

// Import GraphQL schema
import { typeDefs, resolvers } from './schemas';

// Import authentication
import { authenticateToken } from './services/auth';

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {
  await server.start();
  await db(); // Ensure database connection before starting Express

  const PORT = process.env.PORT || 3001;
  const app = express();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Cast expressMiddleware as `any` to avoid TypeScript errors
  app.use(
    '/graphql',
    expressMiddleware(server as any, {
      context: authenticateToken as any,
    })
  );

  // Serve static assets in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));

    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 GraphQL available at http://localhost:${PORT}/graphql`);
  });
};

// Start the server
startApolloServer();





