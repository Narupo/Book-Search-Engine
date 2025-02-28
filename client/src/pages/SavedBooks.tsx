import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries.js';
import { REMOVE_BOOK } from '../utils/mutations.js';
import Auth from '../utils/auth.js';
import { removeBookId } from '../utils/localStorage.js';

// Define a TypeScript interface for a saved book
interface SavedBook {
  bookId: string;
  authors: string[];
  title: string;
  description: string;
  image?: string;
  link: string;
}

const SavedBooks = () => {
  // Fetch user data using Apollo's `useQuery`
  const { loading, data } = useQuery(QUERY_ME);
  const userData = data?.me || { savedBooks: [] };

  // Use Apollo's `useMutation` to remove books
  const [removeBook] = useMutation(REMOVE_BOOK);

  const handleDeleteBook = async (bookId: string) => {
    if (!Auth.loggedIn()) return;

    try {
      await removeBook({
        variables: { bookId },
        update: (cache) => {
          const existingData = cache.readQuery<{ me: { savedBooks: SavedBook[] } }>({ query: QUERY_ME });

          if (existingData && existingData.me) {
            const updatedBooks = existingData.me.savedBooks.filter((book) => book.bookId !== bookId);
            cache.writeQuery({
              query: QUERY_ME,
              data: { me: { ...existingData.me, savedBooks: updatedBooks } },
            });
          }
        },
      });

      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <Container>
      <h2>
        {userData.savedBooks.length
          ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
          : 'You have no saved books!'}
      </h2>
      <Row>
        {userData.savedBooks.map((book: SavedBook) => (
          <Col md={4} key={book.bookId}>
            <Card>
              {book.image && <Card.Img variant="top" src={book.image} alt={book.title} />}
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <p className="small">Authors: {book.authors.join(', ')}</p>
                <Card.Text>{book.description}</Card.Text>
                <Button href={book.link} target="_blank">
                  View Book
                </Button>
                <Button variant="danger" onClick={() => handleDeleteBook(book.bookId)}>
                  Remove
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SavedBooks;
