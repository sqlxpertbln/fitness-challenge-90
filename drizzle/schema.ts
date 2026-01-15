import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, date, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  avatarUrl: text("avatarUrl"),
  
  // Challenge settings
  challengeStartDate: date("challengeStartDate"),
  targetWeight: decimal("targetWeight", { precision: 5, scale: 2 }),
  height: int("height"), // in cm
  birthDate: date("birthDate"),
  gender: mysqlEnum("gender", ["male", "female", "other"]),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Sleep tracking - detailed sleep data like AutoSleep/Sleep app
 */
export const sleepEntries = mysqlTable("sleep_entries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  entryDate: date("entryDate").notNull(),
  
  // Sleep times
  bedTime: timestamp("bedTime"),
  wakeTime: timestamp("wakeTime"),
  
  // Duration in minutes
  totalSleep: int("totalSleep"),
  deepSleep: int("deepSleep"),
  remSleep: int("remSleep"),
  lightSleep: int("lightSleep"),
  awakeTime: int("awakeTime"),
  
  // Quality metrics
  sleepQuality: mysqlEnum("sleepQuality", ["poor", "fair", "good", "excellent"]),
  sleepScore: int("sleepScore"), // 0-100
  
  // Heart rate during sleep
  avgHeartRate: int("avgHeartRate"),
  minHeartRate: int("minHeartRate"),
  
  notes: text("notes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SleepEntry = typeof sleepEntries.$inferSelect;
export type InsertSleepEntry = typeof sleepEntries.$inferInsert;

/**
 * Body composition - weight, body fat, muscle mass etc. (smart scale data)
 */
export const bodyEntries = mysqlTable("body_entries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  entryDate: date("entryDate").notNull(),
  
  // Weight in kg
  weight: decimal("weight", { precision: 5, scale: 2 }),
  
  // Body composition percentages
  bodyFat: decimal("bodyFat", { precision: 4, scale: 1 }),
  visceralFat: int("visceralFat"), // Level 1-59
  muscleMass: decimal("muscleMass", { precision: 5, scale: 2 }), // in kg
  boneMass: decimal("boneMass", { precision: 4, scale: 2 }), // in kg
  bodyWater: decimal("bodyWater", { precision: 4, scale: 1 }), // percentage
  
  // Calculated metrics
  bmi: decimal("bmi", { precision: 4, scale: 1 }),
  bmr: int("bmr"), // Basal metabolic rate in kcal
  metabolicAge: int("metabolicAge"),
  
  notes: text("notes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BodyEntry = typeof bodyEntries.$inferSelect;
export type InsertBodyEntry = typeof bodyEntries.$inferInsert;

/**
 * Blood pressure tracking
 */
export const bloodPressureEntries = mysqlTable("blood_pressure_entries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  entryDate: date("entryDate").notNull(),
  measurementTime: timestamp("measurementTime"),
  
  systolic: int("systolic").notNull(),
  diastolic: int("diastolic").notNull(),
  pulse: int("pulse"),
  
  // Context
  position: mysqlEnum("position", ["sitting", "standing", "lying"]).default("sitting"),
  arm: mysqlEnum("arm", ["left", "right"]).default("left"),
  
  notes: text("notes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BloodPressureEntry = typeof bloodPressureEntries.$inferSelect;
export type InsertBloodPressureEntry = typeof bloodPressureEntries.$inferInsert;

/**
 * Nutrition tracking - meals, calories, water intake
 */
export const nutritionEntries = mysqlTable("nutrition_entries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  entryDate: date("entryDate").notNull(),
  
  // Meal info
  mealType: mysqlEnum("mealType", ["breakfast", "lunch", "dinner", "snack"]),
  mealTime: timestamp("mealTime"),
  description: text("description"),
  
  // Nutritional values
  calories: int("calories"),
  protein: decimal("protein", { precision: 5, scale: 1 }), // in grams
  carbs: decimal("carbs", { precision: 5, scale: 1 }), // in grams
  fat: decimal("fat", { precision: 5, scale: 1 }), // in grams
  fiber: decimal("fiber", { precision: 5, scale: 1 }), // in grams
  sugar: decimal("sugar", { precision: 5, scale: 1 }), // in grams
  
  notes: text("notes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NutritionEntry = typeof nutritionEntries.$inferSelect;
export type InsertNutritionEntry = typeof nutritionEntries.$inferInsert;

/**
 * Water intake tracking (separate for easy daily totals)
 */
export const waterEntries = mysqlTable("water_entries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  entryDate: date("entryDate").notNull(),
  entryTime: timestamp("entryTime"),
  
  amount: int("amount").notNull(), // in ml
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WaterEntry = typeof waterEntries.$inferSelect;
export type InsertWaterEntry = typeof waterEntries.$inferInsert;

/**
 * Training/Workout tracking
 */
export const trainingEntries = mysqlTable("training_entries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  entryDate: date("entryDate").notNull(),
  
  // Workout details
  workoutType: varchar("workoutType", { length: 100 }).notNull(),
  startTime: timestamp("startTime"),
  duration: int("duration"), // in minutes
  
  // Metrics
  caloriesBurned: int("caloriesBurned"),
  avgHeartRate: int("avgHeartRate"),
  maxHeartRate: int("maxHeartRate"),
  distance: decimal("distance", { precision: 6, scale: 2 }), // in km
  steps: int("steps"),
  
  // Intensity
  intensity: mysqlEnum("intensity", ["light", "moderate", "intense", "maximum"]),
  
  // Details
  exercises: json("exercises"), // Array of exercises with sets/reps
  notes: text("notes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TrainingEntry = typeof trainingEntries.$inferSelect;
export type InsertTrainingEntry = typeof trainingEntries.$inferInsert;

/**
 * Sauna/Wellness tracking
 */
export const saunaEntries = mysqlTable("sauna_entries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  entryDate: date("entryDate").notNull(),
  
  saunaType: mysqlEnum("saunaType", ["finnish", "infrared", "steam", "bio"]).default("finnish"),
  duration: int("duration").notNull(), // in minutes
  temperature: int("temperature"), // in celsius
  rounds: int("rounds").default(1),
  
  // Cold exposure
  coldPlunge: boolean("coldPlunge").default(false),
  coldDuration: int("coldDuration"), // in seconds
  
  notes: text("notes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SaunaEntry = typeof saunaEntries.$inferSelect;
export type InsertSaunaEntry = typeof saunaEntries.$inferInsert;

/**
 * Daily summary/mood tracking
 */
export const dailySummaries = mysqlTable("daily_summaries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  entryDate: date("entryDate").notNull(),
  
  // Overall metrics
  mood: mysqlEnum("mood", ["terrible", "bad", "okay", "good", "great"]),
  energyLevel: int("energyLevel"), // 1-10
  stressLevel: int("stressLevel"), // 1-10
  
  // Goals
  goalsAchieved: int("goalsAchieved"),
  totalGoals: int("totalGoals"),
  
  // Reflection
  gratitude: text("gratitude"),
  wins: text("wins"),
  challenges: text("challenges"),
  tomorrowFocus: text("tomorrowFocus"),
  
  notes: text("notes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DailySummary = typeof dailySummaries.$inferSelect;
export type InsertDailySummary = typeof dailySummaries.$inferInsert;

/**
 * Blog posts for challenge updates and tips
 */
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  authorId: int("authorId").notNull(),
  
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  
  category: mysqlEnum("category", ["update", "tips", "progress", "nutrition", "training", "mindset"]).default("update"),
  
  featuredImageUrl: text("featuredImageUrl"),
  videoUrl: text("videoUrl"),
  
  published: boolean("published").default(false),
  publishedAt: timestamp("publishedAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * Service offerings (coaching, memberships)
 */
export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  features: json("features"), // Array of feature strings
  
  price: decimal("price", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("EUR"),
  billingPeriod: mysqlEnum("billingPeriod", ["once", "monthly", "yearly"]).default("once"),
  
  category: mysqlEnum("category", ["coaching", "membership", "program"]).default("program"),
  
  isActive: boolean("isActive").default(true),
  sortOrder: int("sortOrder").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

/**
 * Contact/inquiry submissions
 */
export const inquiries = mysqlTable("inquiries", {
  id: int("id").autoincrement().primaryKey(),
  
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  
  serviceId: int("serviceId"),
  message: text("message").notNull(),
  
  status: mysqlEnum("status", ["new", "contacted", "closed"]).default("new"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;

/**
 * User goals for tracking progress
 */
export const userGoals = mysqlTable("user_goals", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  
  // Goal type
  goalType: mysqlEnum("goalType", [
    "weight", 
    "water", 
    "sleep", 
    "training", 
    "calories",
    "steps",
    "body_fat"
  ]).notNull(),
  
  // Target values
  targetValue: decimal("targetValue", { precision: 10, scale: 2 }).notNull(),
  currentValue: decimal("currentValue", { precision: 10, scale: 2 }),
  startValue: decimal("startValue", { precision: 10, scale: 2 }),
  
  // Unit (kg, L, hours, sessions, kcal, steps, %)
  unit: varchar("unit", { length: 20 }).notNull(),
  
  // Timeframe
  startDate: date("startDate").notNull(),
  targetDate: date("targetDate"),
  
  // Status
  isActive: boolean("isActive").default(true),
  isCompleted: boolean("isCompleted").default(false),
  completedAt: timestamp("completedAt"),
  
  notes: text("notes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserGoal = typeof userGoals.$inferSelect;
export type InsertUserGoal = typeof userGoals.$inferInsert;
