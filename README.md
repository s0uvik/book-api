# Book Management API

A RESTful API for managing books with user authentication, built with Node.js, Express, and MongoDB.

## Features

- User authentication (register/login)
- Book management (CRUD operations)
- File upload support for book covers and PDF files
- JWT-based authentication
- Cloudinary integration for file storage

## Prerequisites

- Node.js
- MongoDB
- Cloudinary account

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=8000
DATABASE_URL=mongodb+srv://<username>:<password>@cluster0.ynatc.mongodb.net
NODE_ENV=development
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_URL=your_cloudinary_url

FRONTEND_DOMAIN=http://localhost:3000/
```

## API Documentation

### Authentication Endpoints

#### Register User
- **URL**: `/api/users/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "message": "User Created",
    "userId": "string",
    "accessToken": "string"
  }
  ```

#### Login User
- **URL**: `/api/users/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Successfully login",
    "userId": "string",
    "accessToken": "string"
  }
  ```

### Book Endpoints

#### Create Book
- **URL**: `/api/books`
- **Method**: `POST`
- **Authentication**: Required (Bearer Token)
- **Content-Type**: `multipart/form-data`
- **Body**:
  ```
  title: string
  genre: string
  coverImage: file (image)
  file: file (PDF)
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "message": "Book Created",
    "bookId": "string"
  }
  ```

#### Get All Books
- **URL**: `/api/books`
- **Method**: `GET`
- **Authentication**: Not Required
- **Success Response**: `200 OK`
  ```json
  [
    {
      "title": "string",
      "genre": "string",
      "author": "string",
      "coverImage": "string (URL)",
      "file": "string (URL)"
    }
  ]
  ```

#### Get Single Book
- **URL**: `/api/books/:bookId`
- **Method**: `GET`
- **Authentication**: Not Required
- **Success Response**: `200 OK`
  ```json
  {
    "title": "string",
    "genre": "string",
    "author": "string",
    "coverImage": "string (URL)",
    "file": "string (URL)"
  }
  ```

#### Update Book
- **URL**: `/api/books/:bookId`
- **Method**: `PATCH`
- **Authentication**: Required (Bearer Token)
- **Content-Type**: `multipart/form-data`
- **Body**:
  ```
  title: string (optional)
  genre: string (optional)
  coverImage: file (image, optional)
  file: file (PDF, optional)
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "status": "200",
    "data": {
      "title": "string",
      "genre": "string",
      "author": "string",
      "coverImage": "string (URL)",
      "file": "string (URL)"
    }
  }
  ```

#### Delete Book
- **URL**: `/api/books/:bookId`
- **Method**: `DELETE`
- **Authentication**: Required (Bearer Token)
- **Success Response**: `204 No Content`

### Authentication

The API uses JWT (JSON Web Token) for authentication. For protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Error Responses

All endpoints may return the following error responses:

- `400 Bad Request`: Invalid request parameters
- `401 Unauthorized`: Missing or invalid authentication
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev
```
