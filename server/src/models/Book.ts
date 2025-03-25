import { Schema, model, type Document } from 'mongoose';

interface BookDocument extends Document {
  bookId: string;
  title: string;
  authors: string[];
  description: string;
  image: string;
  link: string;
}

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedBooks` array in User.js
const bookSchema = new Schema<BookDocument>(
  {
    bookId: {
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
    authors: [
        {
            type: String,
        },
    ],
    description: {
        type: String,
    },
    image: {
        type: String,
    },
    link: {
        type: String,
    },
}
);

const Book = model<BookDocument>('Book', bookSchema);
export {type BookDocument, bookSchema};
export default Book;
