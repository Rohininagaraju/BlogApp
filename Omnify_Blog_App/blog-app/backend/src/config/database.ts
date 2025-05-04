import { DataSource } from "typeorm";
import { User } from "../models/User";
import { Blog } from "../models/Blog";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: process.env.DB_NAME || "blog.db",
  synchronize: true, // Automatically sync database schema (use cautiously in production)
  logging: true, // Enable logging for debugging
  entities: [User, Blog], // Register your entities
  subscribers: [],
  migrations: [],
});