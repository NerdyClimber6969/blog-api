# Blog-API
A RESTful Blog API built with Node.js, Express.js and Prisma that provides convenient and secure way to access and manage your blog's data. 

This API have two related repositories:
- [**Blog App**](https://github.com/nickyuencm117/blog-app) - for users to **read posts and leave comments**.
- [**Blog Studio**](https://github.com/nickyuencm117/blog-studio) - for users to **manage their posts and comments**.

# Table of Content
- [Project Structure](#project-structure)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Authentication](#authentication)
- [Get Started](#getting-started)
- [API Endpoint Documentation](#api-endpoint-documentation)
    - [List of API Endpoints](#list-of-api-endpoints)
    - [API Usage](#api-usage)
    - [Example of Request and Response](#example-of-request-and-response)
    - [Error Handling](#error-handling)
- [Acknowledgments](#acknowledgments)

# Project Structure
```
src/                      
├── controllers/          # Route controllers
├── errors/               # Custom error classes for error handling
├── middlewares/          # Express middlewares (auth, validation, etc.)
├── permissionSystem/     # Role-based access control logic
├── prisma/               # Prisma schema and client file
├── routes/               # Express route definitions
├── services/             # Business logic and database access
├── app.js                # Main Express app entry point
└── passport.js           # Passport strategies setup
```

# Features
- Basic CRUD operation for posts and comments.
- User authentication with JWT.
- Cross-site authentication of both front-ends.
- Role-based user authorization, ensuring only authorized users can access your data.
- Pagination, sorting and search capabilities.
- Data validation to ensure that data from client side is clean and accurate.
- Comprehensive error handling.

# Tech Stack
- [Node.js](https://nodejs.org/) - JavaScript runtime built on Chrome's V8 engine for building scalable network applications.
- [Express.js](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js.
- [Prisma ORM](https://www.prisma.io/) - Next-generation ORM for Node.js and TypeScript, providing type-safe database access.
- [PostgreSQL](https://www.postgresql.org/) - Powerful, open source object-relational database system.
- [Passport.js](https://www.passportjs.org/) - Simple, unobtrusive authentication middleware for Node.js.
- [passport-jwt](http://www.passportjs.org/packages/passport-jwt/) - Passport strategy for authenticating with JSON Web Tokens.
- [passport-local](http://www.passportjs.org/packages/passport-local/) - Passport strategy for authenticating with a username and password.
- [express-validator](https://express-validator.github.io/docs/) - Set of express.js middlewares that wraps validator.js for server-side data validation.
- [bcrypt.js](https://github.com/dcodeIO/bcrypt.js) - Library to help hash passwords securely.
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - An implementation of JSON Web Tokens.
- [express-async-handler](https://github.com/Abazhenov/express-async-handler) - Simple middleware for handling exceptions inside async express routes.
- [dotenv](https://github.com/motdotla/dotenv) - Loads environment variables from a `.env` file into `process.env`.
- [cookie-parser](https://github.com/expressjs/cookie-parser) - Parse Cookie header and populate `req.cookies` with an object keyed by cookie names.
- [cors](https://github.com/expressjs/cors) - Express middleware to enable Cross-Origin Resource Sharing.

# Authentication
This API uses JWT (JSON Web Tokens) for authentication. Upon successful login, a JWT is issued and sent to the client as a **cookie** named `accessToken`. This cookie is:

- **HTTP-only**: Not accessible via JavaScript, helping to prevent XSS attacks.
- **Secure**: Only sent over HTTPS connections.
- **SameSite=None**: Allows cross-site requests from your front-end applications.

To access protected endpoints, clients must include the `accessToken` cookie in their requests. The server will automatically verify the JWT from the cookie for authentication and authorization.

**Note:** 
- Make sure your client applications are served over HTTPS to ensure cookies are transmitted
- Make sure the cookie domain matches clinet's domain

# Getting Started
1. Clone this repository
```
git clone https://github.com/nickyuencm117/blog-api.git
cd blog-api
```

2. Install dependencies
```
npm install
```

3. Create a .env file and set up environment variables
```
DATABASE_URL=<PostgreSQL connection string>
SECRET=<JWT secret key>
PORT=<Port for the server>
BLOG_STUDIO_URL=<Allowed CORS origin for Blog Studio>
BLOG_APP_URL=<Allowed CORS origin for Blog App>
COOKIE_DOMAIN=<Domain for cookies>
```

4. Run database migration
```
npm run migrate:deploy
```

5. Start the server
```
# Run one of the following commands, depending on your environment
npm run dev    # Development
npm run stage  # Staging
npm run start  # Production
```

# API Endpoint Documentation
## List of API Endpoints
### Authentication
| Method | Endpoint          | Description               |
|--------|-------------------|---------------------------|
| `POST` | `/authen/sign-up` | Create a new user account |
| `POST` | `/authen/login`   | Login as user             |
| `POST` | `/authen/logout`  | Logout user               |
| `GET`  | `/authen/verify`  | Verify JWT                |

### Posts (public route)
| Method | Endpoint                   | Description                                   |
|--------|----------------------------|-----------------------------------------------|
| `GET`  | `/posts`                   | Get all published posts' metadata             |
| `GET`  | `/posts/:postId`           | Get a specific published post                 |
| `GET`  | `/posts/:postId/comments`  | Get all comments of a specific published post |

### Users (private route)
| Method   | Endpoint                        | Description                   |
|----------|---------------------------------|-------------------------------|
| `POST`   | `/users/posts`                  | Create a new post             |
| `GET`    | `/users/posts`                  | Get a user's posts' metadata  |
| `PATCH`  | `/users/posts/:postId`          | Update a specific post        |
| `DELETE` | `/users/posts/:postId`          | Delete a specific post        |
| `GET`    | `/users/posts/:postId`          | Get a user's posts            |
| `POST`   | `/users/posts/:postId/comments` | Create a comment              |
| `DELETE` | `/users/comments/:commentId`    | Delete a comment              |
| `GET`    | `/users/comments`               | Get a user's comments         |
| `GET`    | `/users/summary`                | Get a user's summary          |

## API Usage
### URL Parameters
Some routes use URL parameters (i.e. /posts/:postId & /users/comments/:commentId) to fetch data.
| Parameter    | Data Type      | Description     |
|--------------|----------------|-----------------|
| `:postId`    | string of UUID | id of a post    |
| `:commentId` | string of UUID | id of a comment |

### Pagination, Search and Sorting
Routes that support pagination, search, and sorting include:
- `/posts`
- `/posts/:postId/comments`
- `/users/posts`
- `/users/comments`

All parameters below are optional, if not provided, default value or behaviour applies.
| Parameter  | Data Type | Description                      | Default     | Notes                                                                                   |
|------------|-----------|----------------------------------|:-----------:|-----------------------------------------------------------------------------------------|
| `page`     | int       | Page number                      | -           | -                                                                                       |
| `pageSize` | int       | Number of items per page         | -           | -                                                                                       |
| `orderBy`  | string    | Field to order by                | `createdAt` | Accepts: `createdAt`, `updatedAt`, `like`, `dislike`, `title`, `content`                |
| `orderDir` | string    | Order direction                  | `desc`      | Accepts: `asc`, `desc`                                                                  |
| `search`   | string    | Search term for title or content | -           | It searches for the `title` in the case of posts and `content` in the case of comments. |
| `status`   | string    | Publication status               | -           | Only for `/users/posts`. Accepts: `published`, `drafted`, `banned`, `archived`          |

**Notes:** 
- For pagination to work, both `page` and `pageSize` must be provided. If one of them is missing, a empty array of requested item will be returned.
- If the `search` parameter is omitted, no search is applied; all comments or posts will be returned.
- If the `status` parameter is omitted, no status filtering is applied; all posts will be returned.

## Example of Request and Response
### User Registration
**Request:**
```http
POST /authen/sign-up
Content-Type: application/json

{   
    "firstName": "john",
    "lastName": "doe",
    "username": "johndoe123",
    "password": "johndoe123",
    "confirm": "johndoe123"
}
``` 
**Success Response (201 Created):**
```http
Content-type: application/json

{
    "success": true,
    "user": {
        "id": "d95ced77-563e-433a-9a07-f029e357ee39",
        "username": "johndoe123",
        "role": "user"
    }
}
```

### User Login 
**Request:**
```http
POST /authen/login
Content-type: application/json

{   
    "username": "johndoe123",
    "password": "johndoe123"
}
```
**Success Response (200 OK):**
```http
Content-type: application/json
Set-cookie: accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Domain=blog.com; Path=/; Expires=Tue, 01 Jul 2025 08:42:16 GMT; HttpOnly; Secure; SameSite=None

{
    "success": true,
    "username": "johndoe123",
    "exp": 1751359336432
}
```

### Get Post's Metadata
**Request:**
```http
GET /users/posts
Content-Type: application/json
Cookie: accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
**Success Response (200 OK):**
```http
Content-type: application/json
{
    "success": true,
    "total": 1,
    "posts": [
        {
            "id": "c13c8dc1-e982-4123-bcdc-e3e569f829e4",
            "title": "post title 1",
            "summary": "post summary 1",
            "status": "drafted",
            "authorId": "f2642032-7ff3-4199-8fdb-812f11fc0fd7",
            "like": 0,
            "dislike": 0,
            "createdAt": "2025-06-30T10:30:00Z",
            "updatedAt": "2025-06-30T14:22:15Z",
            "author": {
                "username": "johndoe123"
            }
        },
    ]
}
```

### Update Post 
**Request**
```http
PATCH /users/posts/c13c8dc1-e982-4123-bcdc-e3e569f829e4
Content-Type: application/json
Cookie: accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
    "title": "new post title",
    "summary": "new post summary",
    "content": "new post content",
    "status": "published"    
}
```
**Success Response (200 OK):**
```http
Content-type: application/json
{
    "success": true,
    "userId": "f2642032-7ff3-4199-8fdb-812f11fc0fd7",
    "post": {
        "id": "c13c8dc1-e982-4123-bcdc-e3e569f829e4",
        "title": "new post title",
        "content": "new post content",
        "status": "published",
        "updatedAt": "2025-06-30T15:22:15Z",
        "summary": "new post summary"
    }
}
```

## Error Handling
### Error Type
The API implements its own error types with default HTTP status codes:
| Error Type/Name           | Default HTTP Status Code |
|---------------------------|--------------------------|
| ValidationError           | 400                      |
| AuthenticationError       | 401                      | 
| AccessDeniedError         | 403                      |
| ResourceNotFoundError     | 404                      |
| UnexpectedError           | 500                      |

### Example of Error Response 
```json
{   
    "success": false,
    "error" : {
        "name": "error name",
        "message": "error message",
        "statusCode": "http status code",
        "timestamp": "timestamp",
        "details": {} 
    }
}
```

# Acknowledgments
- Express.js team
- Prisma team
- JavaScript community
- Node.js community