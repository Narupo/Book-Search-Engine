import express from 'express';
import path from 'node:path';
import db from './config/connection.js'; // Ensure the correct import
import type { Request, Response } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { authenticateToken } from './services/auth.js';
import { typeDefs, resolvers } from './schemas/index.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startApolloServer = async () => {

  try {
      await server.start();
      await db();
      console.log('MongoDB connected successfully');

      const PORT = process.env.PORT || 3001;
      const app = express();

      app.use(express.urlencoded({ extended: true }));
      app.use(express.json());

      app.use(
          '/graphql',
          expressMiddleware(server, { context: authenticateToken as any })
      );

      app.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
          console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
      });

      if (process.env.NODE_ENV === 'production') {
          app.use(express.static(path.join(__dirname, '../../client/dist')));

          app.get('*', (_req: Request, res: Response) => {
              res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
          });
      }
  } catch (error) {
      console.error('Error starting Apollo Server:', error);
  }
};

startApolloServer();





