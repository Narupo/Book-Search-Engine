import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import dotenv from 'dotenv';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'defaultsecret';
const EXPIRATION = '2h';

interface UserPayload {
  _id: string;
  username: string;
  email: string;
}

// GraphQL-friendly authentication function
export const authenticateToken = ({ req }: { req: any }) => {
  let token = req.body.token || req.query.token || req.headers.authorization;
 // console.log("Token: ", token);
  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return req;
  }

  try {
    const { data } = jwt.verify(token, SECRET_KEY, { maxAge: EXPIRATION }) as { data: UserPayload };
    req.user = data;
  } catch (err) {
    console.log('Invalid token');
  }

  return req;
};

// Signs a JWT with user details
export const signToken = (username: string, email: string, _id: string): string => {
  const payload = { username, email, _id };
  return jwt.sign({ data: payload }, SECRET_KEY, { expiresIn: EXPIRATION });
};

// Custom Authentication Error for GraphQL
export class AuthenticationError extends GraphQLError {
  constructor(message: string) {
    super(message, {
      extensions: { code: 'UNAUTHENTICATED' },
    });
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' });
  }
}


