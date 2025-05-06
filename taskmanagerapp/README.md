# Task Management Application

A web-based task management application with category organization, task filtering, and PostgreSQL database persistence, developed as a final project for CSC 310.

## Features

- Create, edit, and delete tasks with titles, descriptions, categories, and priorities
- Organize tasks by category (Work, Personal, Study, Health, Shopping)
- Filter tasks by status (All, Today, Upcoming, Completed) 
- Sort tasks by due date, priority, or alphabetically
- View tasks in list or grid layout
- Persist data using PostgreSQL database
- Responsive design for various screen sizes

## Technologies Used

- **Frontend**: React, Tailwind CSS, shadcn UI components
- **State Management**: React Hooks, React Query
- **Backend**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **API**: RESTful endpoints for CRUD operations

## Installation and Setup

1. Clone the repository:
   ```
   git clone [repository-url]
   cd task-management-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up the PostgreSQL database:
   - Create a database for the application
   - Configure connection details in the environment variables:
     ```
     DATABASE_URL=postgresql://username:password@localhost:5432/database_name
     ```

4. Run database migrations:
   ```
   npm run db:push
   ```

5. Start the application:
   ```
   npm run dev
   ```

6. Open the application in your browser:
   ```
   http://localhost:5000
   ```

## Project Structure

- `client/`: Frontend React application
  - `src/components/`: UI components
  - `src/hooks/`: Custom React hooks
  - `src/pages/`: Application pages
  - `src/lib/`: Utility functions
- `server/`: Backend Express application
  - `routes.ts`: API endpoints
  - `storage.ts`: Database operations
  - `db.ts`: Database connection
- `shared/`: Shared code between client and server
  - `schema.ts`: Database schema and types

## Database Schema

```typescript
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull().default("Work"),
  priority: text("priority").notNull().default("medium"),
  dueDate: text("due_date"),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: integer("user_id").notNull().default(1),
});
```

## Video Walkthrough

A comprehensive video walkthrough of the application is available in the `docs/` directory, demonstrating all features and technical implementation details.

## License

This project is created for educational purposes as part of CSC 310 coursework.