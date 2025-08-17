# Task Management System

A simple and efficient task management application built with Node.js and Express.

## Features

- Create, read, update, and delete tasks
- Task prioritization (low, medium, high)  
- Task status tracking (pending, in-progress, completed)
- RESTful API design

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm

### Installation

1. Clone the repository
```bash
git clone git@github.com:nyotatimothy/Task-Mgt.git
cd Task-Mgt
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp env.example .env
```

4. Start the server
```bash
npm start
```

The API will be available at `http://localhost:3000`

## API Endpoints

- `GET /` - Health check
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task

## Development

To run in development mode with auto-restart:
```bash
npm run dev
```

## License

MIT
