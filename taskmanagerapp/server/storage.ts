import { tasks, users, type Task, type InsertTask, type UpdateTask, type User, type InsertUser } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Task operations
  getAllTasks(): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<UpdateTask>): Promise<Task>;
  deleteTask(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
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

// Initialize demo tasks if needed
async function initializeDemoTasks() {
  const taskCount = await db.select({ count: tasks.id }).from(tasks);
  
  if (taskCount.length === 0 || taskCount[0].count === 0) {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    const demoTasks = [
      {
        title: 'Complete project presentation',
        description: 'Prepare slides and demo for the client meeting',
        category: 'Work',
        priority: 'high',
        dueDate: today.toISOString().split('T')[0],
        completed: false,
        userId: 1
      },
      {
        title: 'Schedule dentist appointment',
        description: "Call Dr. Smith's office for cleaning",
        category: 'Personal',
        priority: 'medium',
        dueDate: nextWeek.toISOString().split('T')[0],
        completed: false,
        userId: 1
      },
      {
        title: 'Complete JavaScript tutorial',
        description: 'Finish the advanced section on Udemy',
        category: 'Study',
        priority: 'low',
        dueDate: tomorrow.toISOString().split('T')[0],
        completed: true,
        userId: 1
      },
      {
        title: 'Buy groceries',
        description: 'Get milk, eggs, bread, and vegetables',
        category: 'Shopping',
        priority: 'medium',
        dueDate: today.toISOString().split('T')[0],
        completed: false,
        userId: 1
      },
      {
        title: 'Go for a run',
        description: '30 minutes jogging in the park',
        category: 'Health',
        priority: 'high',
        dueDate: tomorrow.toISOString().split('T')[0],
        completed: false,
        userId: 1
      }
    ];
    
    await db.insert(tasks).values(demoTasks);
  }
}

// Initialize database with demo data
initializeDemoTasks().catch(console.error);

// Export an instance of the database storage
export const storage = new DatabaseStorage();
