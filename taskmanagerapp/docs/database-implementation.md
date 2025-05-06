# Database Implementation Details

This document outlines the technical implementation of the PostgreSQL database integration in the Task Management Application.

## Database Schema

The application uses a PostgreSQL database with the following schema:

```typescript
// Defined in shared/schema.ts
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

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});
```

## Database Connection

The database connection is managed using the Drizzle ORM with Neon PostgreSQL serverless client:

```typescript
// In server/db.ts
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });
```

## Storage Layer

The application uses a storage layer to abstract database operations:

```typescript
// In server/storage.ts
export class DatabaseStorage implements IStorage {
  async getAllTasks(): Promise<Task[]> {
    return await db.select().from(tasks);
  }
  
  async getTask(id: number): Promise<Task | undefined> {
    const [task] = await db.select().from(tasks).where(eq(tasks.id, id));
    return task || undefined;
  }
  
  async createTask(insertTask: InsertTask): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values(insertTask)
      .returning();
    return task;
  }
  
  async updateTask(id: number, updateData: Partial<UpdateTask>): Promise<Task> {
    const [updatedTask] = await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, id))
      .returning();
    
    if (!updatedTask) {
      throw new Error(`Task with id ${id} not found`);
    }
    
    return updatedTask;
  }
  
  async deleteTask(id: number): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }
}
```

## API Endpoints

The application exposes RESTful API endpoints for task operations:

```typescript
// In server/routes.ts
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await storage.getAllTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks" });
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    const taskData = insertTaskSchema.parse(req.body);
    const newTask = await storage.createTask(taskData);
    res.status(201).json(newTask);
  } catch (error) {
    if (error instanceof ZodError) {
      const validationError = fromZodError(error);
      return res.status(400).json({ message: validationError.message });
    }
    res.status(500).json({ message: "Error creating task" });
  }
});

// Additional endpoints for GET, PUT, DELETE operations
```

## Frontend Integration 

The frontend uses React Query to interact with the API:

```typescript
// In client/src/hooks/useTaskManagerDB.ts
// Fetch tasks from the API
const { data: tasks = [], isLoading, error } = useQuery({
  queryKey: ['/api/tasks'],
  queryFn: () => apiRequest<Task[]>({ endpoint: '/api/tasks' }),
});

// Create task mutation
const createTaskMutation = useMutation({
  mutationFn: (taskData: TaskFormData) => 
    apiRequest<Task>({
      endpoint: '/api/tasks',
      method: 'POST',
      data: taskData
    }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
  }
});
```

## Key Benefits of Database Integration

1. **Data Persistence**: Tasks are preserved between application sessions
2. **Scalability**: Can handle larger datasets than localStorage
3. **Multi-user Support**: Foundation for user authentication and authorization
4. **Data Integrity**: Database constraints ensure data quality
5. **Query Performance**: Efficient filtering and sorting on the server side

## Migration from LocalStorage

The application was initially built using localStorage for persistence. The transition to PostgreSQL involved:

1. Creating the database schema with appropriate tables
2. Implementing the database storage layer 
3. Creating API endpoints for CRUD operations
4. Updating the frontend to use React Query for data fetching
5. Adding loading states and error handling for network requests

This transition demonstrates an understanding of both client-side and server-side data management approaches.