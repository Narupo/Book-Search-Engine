import { GraphQLError } from 'graphql';
import User from '../models/User.js';
import { signToken } from '../services/auth.js';

// Define argument types for mutations
interface LoginArgs {
  email: string;
  password: string;
}

interface AddUserArgs {
  username: string;
  email: string;
  password: string;
}

interface SaveBookArgs {
  input: {
    bookId: string;
    authors: string[];
    title: string;
    description?: string;
    image?: string;
    link?: string;
  };
}

interface RemoveBookArgs {
  bookId: string;
}

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: any) => {
      if (!context.user) {
        throw new GraphQLError('You need to be logged in!', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }
      return await User.findById(context.user._id);
    },
  },
  Mutation: {
    login: async (_parent: unknown, { email, password }: LoginArgs) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new GraphQLError('Invalid credentials', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }
      // Pass correct arguments to signToken
      const token = signToken(user.username, user.email, user.id);
      return { token, user };
    },

    addUser: async (_parent: unknown, { username, email, password }: AddUserArgs) => {
      const user = await User.create({ username, email, password });
      // Pass correct arguments to signToken
      const token = signToken(user.username, user.email, user.id);
      return { token, user };
    },

    saveBook: async (_parent: unknown, { input }: SaveBookArgs, context: any) => {
      if (!context.user) {
        throw new GraphQLError('You need to be logged in!', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }
      return await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: input } },
        { new: true }
      );
    },

    removeBook: async (_parent: unknown, { bookId }: RemoveBookArgs, context: any) => {
      if (!context.user) {
        throw new GraphQLError('You need to be logged in!', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }
      return await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
    },
  },
};

export default resolvers;

