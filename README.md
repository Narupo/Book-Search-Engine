# 📚 Book Search Engine

A full-stack MERN application that allows users to search for books using the Google Books API, save their favorite titles, and manage their personal reading list. This project was refactored from a RESTful architecture into a fully functional GraphQL API using Apollo Server.

---

## 📑 Table of Contents

- [🚀 Live Deployment](#-live-deployment)
- [📸 Screenshot](#-screenshot)
- [📦 Features](#-features)
- [🛠️ Technologies Used](#-technologies-used)
- [📁 Project Structure](#-project-structure)
- [🧑‍💻 Getting Started (Local Development)](#-getting-started-local-development)
- [⚙️ Environment Variables](#️-environment-variables)
- [📄 License](#-license)
- [👨‍💻 Author](#-author)

---

## 🚀 Live Deployment

🌐 **View the App on Render:**  
[https://book-search-engine-9b1i.onrender.com/]

---

## 📸 Screenshot

![Image](https://github.com/user-attachments/assets/e36e35ff-2d51-4fa5-8f69-3cc98741013b)  

---

## 📦 Features

- 🔍 Search for books using the Google Books API
- 📖 View details like title, author, description, and link to Google Books
- 💾 Save books to your profile
- ❌ Remove saved books from your account
- 🔐 User authentication via JWT
- ⚡ GraphQL API powered by Apollo Server
- 🧠 State managed via Apollo Client on the frontend

---

## 🛠️ Technologies Used

### Frontend
- React
- Vite
- Apollo Client
- React Bootstrap

### Backend
- Node.js
- Express.js
- Apollo Server (GraphQL)
- MongoDB & Mongoose
- JSON Web Token (JWT)

---

## 📁 Project Structure
```
📦 Book-Search-Engine
 ┣ 📂 client       # React frontend
 ┣ 📂 server       # Apollo/Express backend
 ┣ 📄 package.json # Root scripts and concurrency
 ┗ 📄 README.md
```
## 🧑‍💻 Getting Started (Local Development)

1. Clone the repository:
```
git clone https://github.com/your-username/Book-Search-Engine.git
cd Book-Search-Engine
```
2. Install dependencies:
```
npm install
```
3. Start the application:
```
npm run start:dev
```

## ⚙️ Environment Variables

Create a .env file in /server and include:
```
MONGODB_URI=your-mongodb-uri
JWT_SECRET_KEY=your-secret-key
```

## 📄 License

This project is licensed under the MIT License.
Feel free to use, modify, and distribute as needed.








