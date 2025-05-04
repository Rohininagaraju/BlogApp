# Full Stack Blog Application

A modern blog application built with React and Spring Boot.

## Features

- User Authentication (Sign up and Login)
- Blog Creation, Editing, and Deletion
- Public Blog Listing with Pagination
- Responsive Design for Desktop and Mobile
- JWT-based Authentication
- SQL Database Integration

## Tech Stack

### Backend
- Spring Boot 3.2.3
- Spring Security
- Spring Data JPA
- H2 Database
- JWT Authentication
- Maven

### Frontend (Coming Soon)
- React
- Material-UI
- Axios
- React Router

## Getting Started

### Prerequisites
- Java 17 or higher
- Maven
- Node.js (for frontend)
- npm or yarn (for frontend)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Build the project:
```bash
mvn clean install
```

3. Run the application:
```bash
mvn spring-boot:run
```

The backend server will start on `http://localhost:8080`

### API Endpoints

#### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login and get JWT token

#### Blogs
- GET `/api/blogs` - Get all blogs (paginated)
- GET `/api/blogs/{id}` - Get a specific blog
- POST `/api/blogs` - Create a new blog (requires authentication)
- PUT `/api/blogs/{id}` - Update a blog (requires authentication)
- DELETE `/api/blogs/{id}` - Delete a blog (requires authentication)

### Database
The application uses H2 in-memory database. You can access the H2 console at:
`http://localhost:8080/h2-console`

## Frontend Setup (Coming Soon)

## License
This project is licensed under the MIT License. 