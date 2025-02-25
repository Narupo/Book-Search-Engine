import { gql } from '@apollo/client';

// Query to get the logged-in user's data
export const QUERY_ME = gql`
  query Me {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        title
        description
        image
        link
      }
    }
  }
`;