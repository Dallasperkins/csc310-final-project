# Task Management Application - Video Walkthrough Script

## Introduction (30 seconds)
Hello! Today I'll be demonstrating my Task Management Application created for the CSC 310 final project. This web application allows users to organize tasks with features like categories, priorities, due dates, and filtering. The application uses React for the frontend and a PostgreSQL database for persistent storage.

## Application Overview (1 minute)
The application has several key components:
- Header with application title and a "New Task" button
- Sidebar for filtering tasks by status and categories
- Statistics dashboard showing task completion metrics
- Main task list area with options for list and grid views
- Task management dialogs for creating, editing, and deleting tasks

## Feature Demonstration (4-5 minutes)

### Task Creation (1 minute)
1. Click the "New Task" button in the header
2. Fill out the task form with the following details:
   - Title: "Complete Final Project Documentation"
   - Description: "Write up project summary and implementation details"
   - Category: "Study"
   - Priority: "High" 
   - Due Date: *Select tomorrow's date*
3. Click "Save" to create the task
4. Point out how the task appears in the task list

### Task Categories & Filtering (1 minute)
1. Demonstrate the sidebar categories (Work, Personal, Study, Health, Shopping)
2. Click on different category filters to show how the task list updates
3. Use the predefined filters (Today, Upcoming, Completed)
4. Return to "All Tasks" to show the complete list

### Task Management (1 minute)
1. Find a task and click the edit icon
2. Modify some details (change priority or due date)
3. Save the changes and show the updated task
4. Find another task and mark it as complete by clicking the checkbox
5. Demonstrate deleting a task by clicking the delete icon and confirming

### Views & Sorting (1 minute)
1. Switch between list and grid views using the toggle buttons
2. Demonstrate the different sorting options:
   - Sort by due date
   - Sort by priority
   - Sort alphabetically

## Technical Implementation (1 minute)
This application demonstrates several important technical features:
- Responsive design using Tailwind CSS
- State management with React hooks
- Data persistence with PostgreSQL database
- API endpoints for CRUD operations
- Loading states and error handling

## Database Implementation (30 seconds)
One of the key improvements in this application is the transition from using localStorage to a PostgreSQL database:
- Created database schema for tasks with appropriate fields
- Implemented server-side API endpoints for task operations
- Added React Query for efficient data fetching and caching
- Ensured data persistence between application sessions

## Conclusion (30 seconds)
That concludes my demonstration of the Task Management Application. The application meets all the requirements for the final project by implementing a functional, standalone program with PostgreSQL data persistence. It demonstrates the skills learned throughout the course, including React component design, database integration, and responsive UI development.

Thank you for watching!