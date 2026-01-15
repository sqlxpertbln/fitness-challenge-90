import { eq, and, desc, between, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users,
  InsertSleepEntry, sleepEntries,
  InsertBodyEntry, bodyEntries,
  InsertBloodPressureEntry, bloodPressureEntries,
  InsertNutritionEntry, nutritionEntries,
  InsertWaterEntry, waterEntries,
  InsertTrainingEntry, trainingEntries,
  InsertSaunaEntry, saunaEntries,
  InsertDailySummary, dailySummaries,
  InsertBlogPost, blogPosts,
  InsertService, services,
  InsertInquiry, inquiries,
  InsertUserGoal, userGoals
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER FUNCTIONS ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserProfile(userId: number, data: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(users).set(data).where(eq(users.id, userId));
}

// ============ SLEEP ENTRIES ============

export async function createSleepEntry(entry: InsertSleepEntry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(sleepEntries).values(entry);
  return result[0].insertId;
}

export async function getSleepEntries(userId: number, startDate?: string, endDate?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  if (startDate && endDate) {
    return db.select().from(sleepEntries)
      .where(and(
        eq(sleepEntries.userId, userId),
        between(sleepEntries.entryDate, new Date(startDate), new Date(endDate))
      ))
      .orderBy(desc(sleepEntries.entryDate));
  }
  
  return db.select().from(sleepEntries)
    .where(eq(sleepEntries.userId, userId))
    .orderBy(desc(sleepEntries.entryDate));
}

export async function getSleepEntryByDate(userId: number, date: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(sleepEntries)
    .where(and(
      eq(sleepEntries.userId, userId),
      eq(sleepEntries.entryDate, new Date(date))
    ))
    .limit(1);
  
  return result[0] || null;
}

export async function updateSleepEntry(id: number, userId: number, data: Partial<InsertSleepEntry>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(sleepEntries)
    .set(data)
    .where(and(eq(sleepEntries.id, id), eq(sleepEntries.userId, userId)));
}

export async function deleteSleepEntry(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(sleepEntries)
    .where(and(eq(sleepEntries.id, id), eq(sleepEntries.userId, userId)));
}

// ============ BODY ENTRIES ============

export async function createBodyEntry(entry: InsertBodyEntry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(bodyEntries).values(entry);
  return result[0].insertId;
}

export async function getBodyEntries(userId: number, startDate?: string, endDate?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  if (startDate && endDate) {
    return db.select().from(bodyEntries)
      .where(and(
        eq(bodyEntries.userId, userId),
        between(bodyEntries.entryDate, new Date(startDate), new Date(endDate))
      ))
      .orderBy(desc(bodyEntries.entryDate));
  }
  
  return db.select().from(bodyEntries)
    .where(eq(bodyEntries.userId, userId))
    .orderBy(desc(bodyEntries.entryDate));
}

export async function getBodyEntryByDate(userId: number, date: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(bodyEntries)
    .where(and(
      eq(bodyEntries.userId, userId),
      eq(bodyEntries.entryDate, new Date(date))
    ))
    .limit(1);
  
  return result[0] || null;
}

export async function updateBodyEntry(id: number, userId: number, data: Partial<InsertBodyEntry>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(bodyEntries)
    .set(data)
    .where(and(eq(bodyEntries.id, id), eq(bodyEntries.userId, userId)));
}

export async function deleteBodyEntry(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(bodyEntries)
    .where(and(eq(bodyEntries.id, id), eq(bodyEntries.userId, userId)));
}

// ============ BLOOD PRESSURE ENTRIES ============

export async function createBloodPressureEntry(entry: InsertBloodPressureEntry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(bloodPressureEntries).values(entry);
  return result[0].insertId;
}

export async function getBloodPressureEntries(userId: number, startDate?: string, endDate?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  if (startDate && endDate) {
    return db.select().from(bloodPressureEntries)
      .where(and(
        eq(bloodPressureEntries.userId, userId),
        between(bloodPressureEntries.entryDate, new Date(startDate), new Date(endDate))
      ))
      .orderBy(desc(bloodPressureEntries.entryDate));
  }
  
  return db.select().from(bloodPressureEntries)
    .where(eq(bloodPressureEntries.userId, userId))
    .orderBy(desc(bloodPressureEntries.entryDate));
}

export async function updateBloodPressureEntry(id: number, userId: number, data: Partial<InsertBloodPressureEntry>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(bloodPressureEntries)
    .set(data)
    .where(and(eq(bloodPressureEntries.id, id), eq(bloodPressureEntries.userId, userId)));
}

export async function deleteBloodPressureEntry(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(bloodPressureEntries)
    .where(and(eq(bloodPressureEntries.id, id), eq(bloodPressureEntries.userId, userId)));
}

// ============ NUTRITION ENTRIES ============

export async function createNutritionEntry(entry: InsertNutritionEntry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(nutritionEntries).values(entry);
  return result[0].insertId;
}

export async function getNutritionEntries(userId: number, date?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  if (date) {
    return db.select().from(nutritionEntries)
      .where(and(
        eq(nutritionEntries.userId, userId),
        eq(nutritionEntries.entryDate, new Date(date))
      ))
      .orderBy(desc(nutritionEntries.mealTime));
  }
  
  return db.select().from(nutritionEntries)
    .where(eq(nutritionEntries.userId, userId))
    .orderBy(desc(nutritionEntries.entryDate));
}

export async function updateNutritionEntry(id: number, userId: number, data: Partial<InsertNutritionEntry>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(nutritionEntries)
    .set(data)
    .where(and(eq(nutritionEntries.id, id), eq(nutritionEntries.userId, userId)));
}

export async function deleteNutritionEntry(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(nutritionEntries)
    .where(and(eq(nutritionEntries.id, id), eq(nutritionEntries.userId, userId)));
}

// ============ WATER ENTRIES ============

export async function createWaterEntry(entry: InsertWaterEntry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(waterEntries).values(entry);
  return result[0].insertId;
}

export async function getWaterEntries(userId: number, date: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(waterEntries)
    .where(and(
      eq(waterEntries.userId, userId),
      eq(waterEntries.entryDate, new Date(date))
    ))
    .orderBy(desc(waterEntries.entryTime));
}

export async function getDailyWaterTotal(userId: number, date: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select({
    total: sql<number>`SUM(${waterEntries.amount})`
  }).from(waterEntries)
    .where(and(
      eq(waterEntries.userId, userId),
      eq(waterEntries.entryDate, new Date(date))
    ));
  
  return result[0]?.total || 0;
}

export async function deleteWaterEntry(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(waterEntries)
    .where(and(eq(waterEntries.id, id), eq(waterEntries.userId, userId)));
}

// ============ TRAINING ENTRIES ============

export async function createTrainingEntry(entry: InsertTrainingEntry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(trainingEntries).values(entry);
  return result[0].insertId;
}

export async function getTrainingEntries(userId: number, startDate?: string, endDate?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  if (startDate && endDate) {
    return db.select().from(trainingEntries)
      .where(and(
        eq(trainingEntries.userId, userId),
        between(trainingEntries.entryDate, new Date(startDate), new Date(endDate))
      ))
      .orderBy(desc(trainingEntries.entryDate));
  }
  
  return db.select().from(trainingEntries)
    .where(eq(trainingEntries.userId, userId))
    .orderBy(desc(trainingEntries.entryDate));
}

export async function updateTrainingEntry(id: number, userId: number, data: Partial<InsertTrainingEntry>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(trainingEntries)
    .set(data)
    .where(and(eq(trainingEntries.id, id), eq(trainingEntries.userId, userId)));
}

export async function deleteTrainingEntry(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(trainingEntries)
    .where(and(eq(trainingEntries.id, id), eq(trainingEntries.userId, userId)));
}

// ============ SAUNA ENTRIES ============

export async function createSaunaEntry(entry: InsertSaunaEntry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(saunaEntries).values(entry);
  return result[0].insertId;
}

export async function getSaunaEntries(userId: number, startDate?: string, endDate?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  if (startDate && endDate) {
    return db.select().from(saunaEntries)
      .where(and(
        eq(saunaEntries.userId, userId),
        between(saunaEntries.entryDate, new Date(startDate), new Date(endDate))
      ))
      .orderBy(desc(saunaEntries.entryDate));
  }
  
  return db.select().from(saunaEntries)
    .where(eq(saunaEntries.userId, userId))
    .orderBy(desc(saunaEntries.entryDate));
}

export async function updateSaunaEntry(id: number, userId: number, data: Partial<InsertSaunaEntry>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(saunaEntries)
    .set(data)
    .where(and(eq(saunaEntries.id, id), eq(saunaEntries.userId, userId)));
}

export async function deleteSaunaEntry(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(saunaEntries)
    .where(and(eq(saunaEntries.id, id), eq(saunaEntries.userId, userId)));
}

// ============ DAILY SUMMARIES ============

export async function createOrUpdateDailySummary(entry: InsertDailySummary) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(dailySummaries)
    .where(and(
      eq(dailySummaries.userId, entry.userId),
      eq(dailySummaries.entryDate, entry.entryDate)
    ))
    .limit(1);
  
  if (existing.length > 0) {
    await db.update(dailySummaries)
      .set(entry)
      .where(eq(dailySummaries.id, existing[0].id));
    return existing[0].id;
  }
  
  const result = await db.insert(dailySummaries).values(entry);
  return result[0].insertId;
}

export async function getDailySummary(userId: number, date: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(dailySummaries)
    .where(and(
      eq(dailySummaries.userId, userId),
      eq(dailySummaries.entryDate, new Date(date))
    ))
    .limit(1);
  
  return result[0] || null;
}

export async function getDailySummaries(userId: number, startDate?: string, endDate?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  if (startDate && endDate) {
    return db.select().from(dailySummaries)
      .where(and(
        eq(dailySummaries.userId, userId),
        between(dailySummaries.entryDate, new Date(startDate), new Date(endDate))
      ))
      .orderBy(desc(dailySummaries.entryDate));
  }
  
  return db.select().from(dailySummaries)
    .where(eq(dailySummaries.userId, userId))
    .orderBy(desc(dailySummaries.entryDate));
}

// ============ BLOG POSTS ============

export async function createBlogPost(post: InsertBlogPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(blogPosts).values(post);
  return result[0].insertId;
}

export async function getBlogPosts(publishedOnly: boolean = true) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  if (publishedOnly) {
    return db.select().from(blogPosts)
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.publishedAt));
  }
  
  return db.select().from(blogPosts)
    .orderBy(desc(blogPosts.createdAt));
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(blogPosts)
    .where(eq(blogPosts.slug, slug))
    .limit(1);
  
  return result[0] || null;
}

export async function getBlogPostById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(blogPosts)
    .where(eq(blogPosts.id, id))
    .limit(1);
  
  return result[0] || null;
}

export async function updateBlogPost(id: number, data: Partial<InsertBlogPost>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

// ============ SERVICES ============

export async function getServices(activeOnly: boolean = true) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  if (activeOnly) {
    return db.select().from(services)
      .where(eq(services.isActive, true))
      .orderBy(services.sortOrder);
  }
  
  return db.select().from(services).orderBy(services.sortOrder);
}

export async function getServiceById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(services)
    .where(eq(services.id, id))
    .limit(1);
  
  return result[0] || null;
}

export async function createService(service: InsertService) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(services).values(service);
  return result[0].insertId;
}

export async function updateService(id: number, data: Partial<InsertService>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(services).set(data).where(eq(services.id, id));
}

export async function deleteService(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(services).where(eq(services.id, id));
}

// ============ INQUIRIES ============

export async function createInquiry(inquiry: InsertInquiry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(inquiries).values(inquiry);
  return result[0].insertId;
}

export async function getInquiries() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
}

export async function updateInquiryStatus(id: number, status: "new" | "contacted" | "closed") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(inquiries).set({ status }).where(eq(inquiries.id, id));
}

// ============ USER GOALS ============

export async function createUserGoal(goal: InsertUserGoal) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(userGoals).values(goal);
  return result[0].insertId;
}

export async function getUserGoals(userId: number, activeOnly: boolean = true) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  if (activeOnly) {
    return db.select().from(userGoals)
      .where(and(eq(userGoals.userId, userId), eq(userGoals.isActive, true)))
      .orderBy(desc(userGoals.createdAt));
  }
  
  return db.select().from(userGoals)
    .where(eq(userGoals.userId, userId))
    .orderBy(desc(userGoals.createdAt));
}

export async function getUserGoalById(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(userGoals)
    .where(and(eq(userGoals.id, id), eq(userGoals.userId, userId)))
    .limit(1);
  
  return result[0] || null;
}

export async function updateUserGoal(id: number, userId: number, data: Partial<InsertUserGoal>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(userGoals)
    .set(data)
    .where(and(eq(userGoals.id, id), eq(userGoals.userId, userId)));
}

export async function deleteUserGoal(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(userGoals)
    .where(and(eq(userGoals.id, id), eq(userGoals.userId, userId)));
}

export async function completeUserGoal(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(userGoals)
    .set({ isCompleted: true, completedAt: new Date() })
    .where(and(eq(userGoals.id, id), eq(userGoals.userId, userId)));
}
