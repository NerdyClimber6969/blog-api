# Blog-API
A RESTful Blog API built with Node.js, Express.js and Prisma that provides  convenient and secure way to access and manage your blog's data. 

This API have two related pages:
- [**Blog App**](www.abc.com) -  for users to **read posts and leave comments**.
- [**Blog Studio**](www.abc.com) - for users to **manage their posts and comments**.

# Content
- [Features](#features)
- [Get Started](#get-started)
- [API Endpoint Documentation](#api-endpoint-documentation)
    - [Lists of API Endpoints](#lists-of-api-endpoints)
    - [API Usage](#api-usage)
    - [Example of Request and Response](#example-of-request-and-response)
    - [Error Handling](#error-handling)
- [Acknowledgments](#acknowledgments)

# Features
- Basic CRUD operation for posts and comments.
- User authentication with JWT.
- Http-only and secure cookies for cross-site authentication of both front-end
- Role based user authorization, making sure only authorized users can access your data.
- Pagination, sorting and search capabilities.
- Data validation to ensure that data from client side is clean and accurate.
- Error handling 

# Get Started
1. Clone this repository
```
git clone https://github.com/NerdyClimber6969/blog-api.git
cd blog-api
```

2. Install dependencies
```
npm install
```

3. Create a .env file and setup environmental variable
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
npm run migrate deploy
```

5. Start the server
```
# run one of the following command, depending your environment
npm run dev    # Development
npm run stage  # Staging
npm run start  # Production
```

# API Endpoint Documentation
## Lists of API Endpoints
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
| `GET`  | `/posts/:postsId/comments` | Get all comments of a specific published post |

### Users (private route)
| Method   | Endpoint                        | Description                   |
|----------|---------------------------------|-------------------------------|
| `POST`   | `/users/posts`                  | Create a new post             |
| `GET`    | `/users/posts`                  | Get posts' metadata of a user |
| `PATCH`  | `/users/posts/:postsId`        | Update a specific post        |
| `DELETE` | `/users/posts/:postId`          | Delete a specific post        |
| `GET`    | `/users/posts/:postId`          | Get a post of a user          |
| `POST`   | `/users/posts/:postId/comments` | Create a comment              |
| `DELETE` | `/users/comments/:commentId`    | Delete a comment              |
| `GET`    | `/users/comments`               | Get user's comments           |
| `GET`    | `/users/summary`                | Get user's summary            |

## API Usage
### URL Parameters
Some routes use URL parameters (i.e. /posts/:postId & /users/comments/:commentId) to fetch data.
| Parameter    | Data Type      | Description     |
|--------------|----------------|-----------------|
| `:postId`    | string of UUID | id of a post    |
| `:commentId` | string of UUID | id of a comment |

### Pagination, Search and Sorting
Routes that support pagination, search and soring include:
- `/posts`
- `/posts/:postId/comments`
- `/users/posts`
- `/users/comments`

All parameters below are optional, if not provided, default value or behaviour applies.
| Parameter  | Data Type | Description                      | Default     | Notes                                                                          |
|------------|-----------|----------------------------------|:-----------:|--------------------------------------------------------------------------------|
| `page`     | int       | Page number                      | -           | -                                                                              |
| `pageSize` | int       | Number of items per page         | -           | -                                                                              |
| `orderBy`  | string    | Field to order by                | `createdAt` | Accepts: `createdAt`, `updatedAt`, `like`, `dislike`, `title`, `content`       |
| `orderDir` | string    | Order direction                  | `desc`      | Accepts: `asc`, `desc`                                                         |
| `search`   | string    | Search term for title or content | -           | It search for title in case of `titles` and content in case of `comments`.     |
| `status`   | string    | Publication status               | -           | Only for `/users/posts`. Accepts: `published`, `drafted`, `banned`, `archived` |

Further Notes: 
- For pagination to works, both `page` and `pageSize` must be provided. If one of them is missing, a empty array of requested item will be returned.
- If `search` parameter omitted, no searching apply, all comments or posts will be returned.
- If `status` parameter omitted, no filtering of status apply, all posts will be returned.

## Example of Request and Response
### User Registration
```http
# Request
POST /authen/sign-up
Content-Type: application/json

{   
    "firstName": "john",
    "lastName": "doe",
    "username": "johndoe123",
    "password": "johndoe123",
    "confirm": "johndoe123"
}

--------------------------------

# Success Response (201 Created):
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
```http
# Request
POST /authen/login
Content-type: application/json

{   
    "username": "johndoe123",
    "password": "johndoe123",
}

-------------------------------

# Success Response (200 OK):
Content-type: application/json
Set-cookie: accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; Domain=blog.com; Path=/; Expires=Tue, 01 Jul 2025 08:42:16 GMT; HttpOnly; Secure; SameSite=None

{
    "success": true,
    "username": "johndoe123",
    "exp": 1751359336432
}
```

### Get Post's Metadata
```http
# Request
GET /users/posts
Content-Type: application/json
Cookie: accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
----------------------------------

# Success Response (200 OK):
{
    "success": true,
    "total": 20,
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
        ...
    ]
}
```

### Update Post 
``` http
# Request
PATCH /users/posts/c13c8dc1-e982-4123-bcdc-e3e569f829e4
Content-Type: application/json
Cookie: accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
    "title": "new post title",
    "summary": "new post summary",
    "content": "new post content"
    "status": "published",    
}

-----------------------------------

# Success Response (200 OK):
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
The API implements its own error type with default HTTP status code:
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

# details vary according to error type
```

# Acknowledgments
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