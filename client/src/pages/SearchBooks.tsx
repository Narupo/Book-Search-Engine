import { useState } from 'react';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { searchGoogleBooks } from '../utils/API';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

const SearchBooks = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchedBooks, setSearchedBooks] = useState<any[]>([]);
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  // Use Apollo's `useMutation` hook for saving books
  const [saveBook] = useMutation(SAVE_BOOK);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    if (!searchInput) {
      return;
    }
  
    try {
      const response = await searchGoogleBooks(searchInput);
      const data = await response.json(); // Ensure JSON parsing
  
      if (!data.items) {
        throw new Error("No books found.");
      }
  
      const bookData = data.items.map((book: any) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description || 'No description available',
        image: book.volumeInfo.imageLinks?.thumbnail || '',
        link: book.volumeInfo.infoLink,
      }));
  
      setSearchedBooks(bookData);
    } catch (err) {
      console.error(err);
    }
  };
  

  const handleSaveBook = async (bookId: string) => {
    if (!Auth.loggedIn()) {
      return;
    }

    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
    if (!bookToSave) return;

    try {
      await saveBook({
        variables: { input: bookToSave },
      });

      setSavedBookIds([...savedBookIds, bookId]);
      saveBookIds([...savedBookIds, bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Form onSubmit={handleFormSubmit}>
        <Row>
          <Col xs={12} md={8}>
            <Form.Control
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for a book"
            />
          </Col>
          <Col xs={12} md={4}>
            <Button type="submit">Search</Button>
          </Col>
        </Row>
      </Form>

      <Container>
        <h2>{searchedBooks.length ? `Viewing ${searchedBooks.length} results:` : 'Search for a book'}</h2>
        <Row>
          {searchedBooks.map((book) => (
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
                  {Auth.loggedIn() && (
                    <Button
                      disabled={savedBookIds.includes(book.bookId)}
                      onClick={() => handleSaveBook(book.bookId)}
                    >
                      {savedBookIds.includes(book.bookId) ? 'Saved' : 'Save Book'}
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
};

export default SearchBooks;

