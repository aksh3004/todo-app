# Todo App - Full Stack Application

A small full-stack todo application with a React/ Redux Toolkit frontend and Node.js/TypeScript backend along with an in-memory database.

## Features

- You can organize your todo items by categories.
- Filter items based on completion status.
- Sort by date they are due or by creation date.
- Responsive UI.
- Basic error handling and input validation for both frontend and backend.
- Additional search functionality.

## Installation & Setup

### Prerequisites

- Node.js 16+ and npm/yarn

### Steps

1. **Clone or extract the project**

   ```bash
   cd "TODO app"
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development servers**

   ```bash
   npm run dev
   ```

   This will start both servers concurrently:

   - Backend: http://localhost:4000
   - Frontend: http://localhost:5173

### Backend only

```bash
cd backend
npm install
npm run dev
```

### Frontend only

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Todos

- `GET /todos` - Get all todos
- `GET /todos/:id` - Get todos by ID
- `POST /todos` - Create new todo
- `PATCH /todos/:id` - Update existing todo
- `DELETE /todos/:id` - Delete existing todo
- `GET categories/:categoryId/todos` - Get todos by category

### Categories

- `GET /categories` - Get all categories
- `GET /categories/:id` - Get categories by ID
- `POST /categories` - Create new category
- `PATCH /categories/:id` - Update existing category
- `DELETE /categories/:id` - Delete existing category

## Usage

1. **Create a Category** - Use the "New Category" form in the sidebar to organize your todos.
2. **Add a Todo** - Fill in the todo form with title, description (optional), category, and due date.
3. **Manage Todos** - Check off a todo item to mark it complete. You could update/ delete it as needed.
4. **Filter & Sort** - Use the filter dropdown to view completed/ pending todos, or sort by date.
5. **Select Categories** - Click on a category in the sidebar to view todos in that category only.
6. **Search Term** - Enter keywords in the search box to show any todos that have those keywords in their titles or descriptions.

## Design Decisions

### State Management

I chose Redux tooklit as mentioned in the requirements and also because it offers good TypeScript support.

### Database

I used an in-memory database for faster development and easier testing.

### API Design

I implemented RESTful API endpoints for CRUD operations. I also used proper HTTP methods (GET, POST, etc.,) along with correct status codes to provide more context to the user.

### Frontend Architecture

I have created components for displaying todo items, todo forms and category forms and reused them where feasible.

### Error Handling

I implemented proper error handling with input validation on frontend and backend. Try catch blocks are also used to display correct stack trace without breaking the application in case of errors.

### Redux store

I implemented Redux store and created slices for categories and todos, for managing the application state.

## Additional Feature

Added search functionality to seach across todos. If the keywords are in any title or description, then all todos with those keywords are shown.
