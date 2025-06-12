# 🎵 OpenMusic API

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Hapi.js](https://img.shields.io/badge/Hapi.js-21.x-orange.svg)](https://hapi.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.x-blue.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7.x-red.svg)](https://redis.io/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-3.x-orange.svg)](https://www.rabbitmq.com/)
[![ESLint](https://img.shields.io/badge/ESLint-Airbnb-purple.svg)](https://eslint.org/)

A comprehensive RESTful API for managing music albums, songs, playlists, and user interactions. Built with modern Node.js technologies and microservices architecture for the **Dicoding Indonesia - Belajar Fundamental Back-End dengan JavaScript** course.

## 🏗️ Architecture Overview

This project implements a **microservices architecture** with the following components:

- **🎵 OpenMusic API**: Main RESTful API service
- **📧 OpenMusic Consumer**: Background service for handling playlist exports via email

## ✨ Key Features

### 🎼 Core Music Management
- **Albums Management**: Complete CRUD operations for music albums
- **Songs Management**: Full song catalog with filtering capabilities
- **Album Cover Upload**: Support for album artwork with file validation
- **Search & Filtering**: Advanced search across albums and songs

### 👥 User & Authentication
- **User Registration & Authentication**: Secure JWT-based auth system
- **Access & Refresh Tokens**: Robust token management with automatic refresh
- **Password Security**: BCrypt encryption for user credentials

### 🎵 Playlist System
- **Personal Playlists**: Create and manage custom playlists
- **Collaborative Playlists**: Share playlists with other users
- **Playlist Activities**: Track all playlist modifications with audit trail
- **Songs Management**: Add/remove songs from playlists

### ❤️ Social Features
- **Album Likes**: Like/unlike albums with real-time counters
- **Like Analytics**: Track album popularity

### 📤 Advanced Features
- **Playlist Export**: Asynchronous playlist export to email (JSON format)
- **Background Processing**: RabbitMQ-powered message queuing
- **Email Notifications**: Automated email delivery with Nodemailer
- **Caching Layer**: Redis-powered caching for performance optimization

## 🛠️ Technology Stack

### Backend Framework
- **[Hapi.js](https://hapi.dev/)** - Robust Node.js web framework
- **[Node.js](https://nodejs.org/)** - JavaScript runtime (ES Modules)

### Database & Storage
- **[PostgreSQL](https://www.postgresql.org/)** - Primary relational database
- **[Redis](https://redis.io/)** - In-memory caching and session storage
- **[node-pg-migrate](https://github.com/salsita/node-pg-migrate)** - Database migration management

### Authentication & Security
- **[@hapi/jwt](https://github.com/hapijs/jwt)** - JSON Web Token implementation
- **[BCrypt](https://github.com/kelektiv/node.bcrypt.js)** - Password hashing
- **[Joi](https://joi.dev/)** - Schema validation

### Message Queue & Email
- **[RabbitMQ](https://www.rabbitmq.com/)** - Message broker for async processing
- **[amqplib](https://github.com/amqplib/amqplib)** - AMQP client for Node.js
- **[Nodemailer](https://nodemailer.com/)** - Email sending capabilities

### Development & Code Quality
- **[ESLint](https://eslint.org/)** - Code linting with Airbnb configuration
- **[Nodemon](https://nodemon.io/)** - Development server with auto-restart
- **[auto-bind](https://github.com/sindresorhus/auto-bind)** - Method binding utility

## 📊 Database Schema

The application uses a well-structured relational database with the following entities:

- **albums** - Album information with cover image support
- **songs** - Song catalog with album relationships
- **users** - User accounts and authentication
- **playlists** - User-created playlists
- **playlist_songs** - Many-to-many relationship for playlist contents
- **playlist_song_activities** - Audit trail for playlist modifications
- **collaborations** - Playlist collaboration management
- **user_album_likes** - Album like/unlike tracking
- **authentications** - Refresh token storage

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18.x or higher)
- **PostgreSQL** (v13.x or higher)
- **Redis** (v6.x or higher)
- **RabbitMQ** (v3.x or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd openmusic
   ```

2. **Install API dependencies**
   ```bash
   cd openmusic-api
   npm install
   ```

3. **Install Consumer dependencies**
   ```bash
   cd ../openmusic-consumer
   npm install
   ```

### Configuration

1. **API Configuration**
   ```bash
   cd openmusic-api
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   # Server Configuration
   HOST=localhost
   PORT=5000

   # Database Configuration
   PGUSER=your_db_user
   PGHOST=localhost
   PGPASSWORD=your_db_password
   PGDATABASE=openmusic
   PGPORT=5432

   # JWT Configuration
   ACCESS_TOKEN_KEY=your_access_token_secret
   REFRESH_TOKEN_KEY=your_refresh_token_secret
   ACCESS_TOKEN_AGE=1800

   # RabbitMQ Configuration
   RABBITMQ_SERVER=amqp://localhost

   # Redis Configuration
   REDIS_SERVER=localhost
   ```

2. **Consumer Configuration**
   ```bash
   cd openmusic-consumer
   cp .env.example .env
   ```
   
   Configure your `.env` file:
   ```env
   # Database Configuration
   PGUSER=your_db_user
   PGHOST=localhost
   PGPASSWORD=your_db_password
   PGDATABASE=openmusic
   PGPORT=5432

   # SMTP Configuration
   SMTP_HOST=your_smtp_host
   SMTP_PORT=587
   SMTP_USER=your_email@example.com
   SMTP_PASSWORD=your_email_password

   # RabbitMQ Configuration
   RABBITMQ_SERVER=amqp://localhost
   ```

### Database Setup

1. **Create PostgreSQL database**
   ```bash
   createdb openmusic
   ```

2. **Run migrations**
   ```bash
   cd openmusic-api
   npm run migrate up
   ```

### Running the Services

1. **Start the API server**
   ```bash
   cd openmusic-api
   npm start
   ```

2. **Start the Consumer service** (in a new terminal)
   ```bash
   cd openmusic-consumer
   npm start
   ```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints
- `POST /authentications` - User login
- `PUT /authentications` - Refresh access token
- `DELETE /authentications` - User logout

### User Management
- `POST /users` - User registration

### Albums
- `GET /albums` - Get all albums (with optional filtering)
- `GET /albums/{id}` - Get album by ID with songs
- `POST /albums` - Create new album
- `PUT /albums/{id}` - Update album
- `DELETE /albums/{id}` - Delete album
- `POST /albums/{id}/covers` - Upload album cover
- `GET /albums/{id}/likes` - Get album likes count
- `POST /albums/{id}/likes` - Like an album (🔒 Auth required)
- `DELETE /albums/{id}/likes` - Unlike an album (🔒 Auth required)

### Songs
- `GET /songs` - Get all songs (with optional filtering)
- `GET /songs/{id}` - Get song by ID
- `POST /songs` - Create new song
- `PUT /songs/{id}` - Update song
- `DELETE /songs/{id}` - Delete song

### Playlists
- `GET /playlists` - Get user's playlists (🔒 Auth required)
- `GET /playlists/{id}/songs` - Get playlist songs (🔒 Auth required)
- `GET /playlists/{id}/activities` - Get playlist activity log (🔒 Auth required)
- `POST /playlists` - Create new playlist (🔒 Auth required)
- `POST /playlists/{id}/songs` - Add song to playlist (🔒 Auth required)
- `DELETE /playlists/{id}` - Delete playlist (🔒 Auth required)
- `DELETE /playlists/{id}/songs` - Remove song from playlist (🔒 Auth required)

### Collaborations
- `POST /collaborations` - Add playlist collaborator (🔒 Auth required)
- `DELETE /collaborations` - Remove playlist collaborator (🔒 Auth required)

### Exports
- `POST /export/playlists/{id}` - Export playlist to email (🔒 Auth required)

### File Uploads
- `GET /uploads/file/images/{filename}` - Serve uploaded images

## 🔒 Authentication

The API uses **JWT (JSON Web Tokens)** for authentication with a dual-token system:

- **Access Token**: Short-lived token (30 minutes) for API access
- **Refresh Token**: Long-lived token for generating new access tokens

### Usage Example

1. **Login to get tokens**
   ```bash
   curl -X POST http://localhost:5000/authentications \
     -H "Content-Type: application/json" \
     -d '{"username": "user123", "password": "password123"}'
   ```

2. **Use access token in requests**
   ```bash
   curl -X GET http://localhost:5000/playlists \
     -H "Authorization: Bearer your_access_token"
   ```

## 🧪 Development

### Code Quality

This project follows strict code quality standards:

```bash
# Run linting
npm run lint

# Run linting with auto-fix
npm run lint -- --fix
```

### Database Migrations

```bash
# Create new migration
npm run migrate create migration_name

# Run pending migrations
npm run migrate up

# Rollback last migration
npm run migrate down
```

## 🏛️ Project Structure

```
openmusic/
├── openmusic-api/              # Main API service
│   ├── src/
│   │   ├── api/               # Request handlers
│   │   ├── plugins/           # Hapi.js plugins
│   │   ├── routes/            # Route definitions
│   │   ├── services/          # Business logic services
│   │   │   ├── postgres/      # Database services
│   │   │   ├── rabbitmq/      # Message queue services
│   │   │   ├── redis/         # Cache services
│   │   │   └── storage/       # File storage services
│   │   ├── utils/             # Utility functions
│   │   ├── validators/        # Input validation schemas
│   │   └── server.js          # Application entry point
│   ├── migrations/            # Database migrations
│   └── package.json
│
├── openmusic-consumer/         # Background consumer service
│   ├── src/
│   │   ├── services/          # Consumer services
│   │   │   ├── postgres/      # Database access
│   │   │   ├── rabbitmq/      # Message queue listener
│   │   │   └── nodemailer/    # Email services
│   │   ├── utils/             # Utility functions
│   │   └── consumer.js        # Consumer entry point
│   └── package.json
│
└── README.md                  # Project documentation
```

## 🚀 Performance Features

- **Redis Caching**: Album likes are cached for 30 minutes
- **Connection Pooling**: PostgreSQL connection pooling for optimal database performance
- **Async Processing**: Background playlist export to prevent API blocking
- **File Upload Optimization**: Efficient file handling with stream processing

## 🔒 Security Features

- **Password Hashing**: BCrypt with salt rounds for secure password storage
- **JWT Authentication**: Stateless authentication with token expiration
- **Input Validation**: Comprehensive request validation using Joi schemas
- **File Upload Security**: MIME type validation for image uploads
- **SQL Injection Prevention**: Parameterized queries throughout the application

## 🌟 Advanced Features

### Caching Strategy
- **Album Likes**: Cached in Redis for 30 minutes to reduce database load
- **Cache Headers**: Proper cache headers for client-side optimization

### Audit Trail
- **Playlist Activities**: Complete audit log of playlist modifications
- **User Actions**: Track who added/removed songs and when

### Background Processing
- **Async Exports**: Playlist exports processed in background queue
- **Email Notifications**: Automated email delivery with JSON attachments

## 📝 License

This project is part of the **Dicoding Indonesia - Belajar Fundamental Back-End dengan JavaScript** course submission.

## 🎓 Learning Outcomes

This project demonstrates proficiency in:

- **RESTful API Design**: Following REST principles and best practices
- **Database Design**: Normalized relational database with proper relationships
- **Authentication & Authorization**: Secure JWT implementation
- **Microservices Architecture**: Separation of concerns with multiple services
- **Message Queuing**: Asynchronous processing with RabbitMQ
- **Caching Strategies**: Performance optimization with Redis
- **File Upload Handling**: Secure file upload and serving
- **Input Validation**: Comprehensive data validation
- **Error Handling**: Proper error responses and logging
- **Code Quality**: ESLint configuration and clean code practices

---

**Developed with ❤️ for Dicoding Indonesia**

*This project showcases modern Node.js backend development practices and enterprise-grade architecture patterns.*