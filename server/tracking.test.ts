import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the database functions
vi.mock("./db", () => ({
  createSleepEntry: vi.fn().mockResolvedValue(1),
  getSleepEntries: vi.fn().mockResolvedValue([]),
  getSleepEntryByDate: vi.fn().mockResolvedValue(null),
  updateSleepEntry: vi.fn().mockResolvedValue(undefined),
  deleteSleepEntry: vi.fn().mockResolvedValue(undefined),
  createBodyEntry: vi.fn().mockResolvedValue(1),
  getBodyEntries: vi.fn().mockResolvedValue([]),
  getBodyEntryByDate: vi.fn().mockResolvedValue(null),
  updateBodyEntry: vi.fn().mockResolvedValue(undefined),
  deleteBodyEntry: vi.fn().mockResolvedValue(undefined),
  createBloodPressureEntry: vi.fn().mockResolvedValue(1),
  getBloodPressureEntries: vi.fn().mockResolvedValue([]),
  updateBloodPressureEntry: vi.fn().mockResolvedValue(undefined),
  deleteBloodPressureEntry: vi.fn().mockResolvedValue(undefined),
  createNutritionEntry: vi.fn().mockResolvedValue(1),
  getNutritionEntries: vi.fn().mockResolvedValue([]),
  updateNutritionEntry: vi.fn().mockResolvedValue(undefined),
  deleteNutritionEntry: vi.fn().mockResolvedValue(undefined),
  createWaterEntry: vi.fn().mockResolvedValue(1),
  getWaterEntries: vi.fn().mockResolvedValue([]),
  getDailyWaterTotal: vi.fn().mockResolvedValue(2500),
  deleteWaterEntry: vi.fn().mockResolvedValue(undefined),
  createTrainingEntry: vi.fn().mockResolvedValue(1),
  getTrainingEntries: vi.fn().mockResolvedValue([]),
  updateTrainingEntry: vi.fn().mockResolvedValue(undefined),
  deleteTrainingEntry: vi.fn().mockResolvedValue(undefined),
  createSaunaEntry: vi.fn().mockResolvedValue(1),
  getSaunaEntries: vi.fn().mockResolvedValue([]),
  updateSaunaEntry: vi.fn().mockResolvedValue(undefined),
  deleteSaunaEntry: vi.fn().mockResolvedValue(undefined),
  createOrUpdateDailySummary: vi.fn().mockResolvedValue(1),
  getDailySummary: vi.fn().mockResolvedValue(null),
  getDailySummaries: vi.fn().mockResolvedValue([]),
  getBlogPosts: vi.fn().mockResolvedValue([]),
  getBlogPostBySlug: vi.fn().mockResolvedValue(null),
  getBlogPostById: vi.fn().mockResolvedValue(null),
  createBlogPost: vi.fn().mockResolvedValue(1),
  updateBlogPost: vi.fn().mockResolvedValue(undefined),
  deleteBlogPost: vi.fn().mockResolvedValue(undefined),
  getServices: vi.fn().mockResolvedValue([]),
  getServiceById: vi.fn().mockResolvedValue(null),
  createService: vi.fn().mockResolvedValue(1),
  updateService: vi.fn().mockResolvedValue(undefined),
  deleteService: vi.fn().mockResolvedValue(undefined),
  createInquiry: vi.fn().mockResolvedValue(1),
  getInquiries: vi.fn().mockResolvedValue([]),
  updateInquiryStatus: vi.fn().mockResolvedValue(undefined),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("Sleep Tracking", () => {
  it("creates a sleep entry", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.sleep.create({
      entryDate: "2026-01-15",
      totalSleep: 450,
      deepSleep: 90,
      remSleep: 120,
      sleepQuality: "good",
    });

    expect(result).toEqual({ id: 1 });
  });

  it("lists sleep entries", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.sleep.list({});

    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Body Composition Tracking", () => {
  it("creates a body entry", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.body.create({
      entryDate: "2026-01-15",
      weight: "82.5",
      bodyFat: "18.5",
      muscleMass: "35.2",
    });

    expect(result).toEqual({ id: 1 });
  });

  it("lists body entries", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.body.list({});

    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Water Tracking", () => {
  it("adds a water entry", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.water.add({
      entryDate: "2026-01-15",
      amount: 500,
    });

    expect(result).toEqual({ id: 1 });
  });

  it("gets daily water total", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.water.dailyTotal({ date: "2026-01-15" });

    expect(result).toBe(2500);
  });
});

describe("Training Tracking", () => {
  it("creates a training entry", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.training.create({
      entryDate: "2026-01-15",
      workoutType: "Krafttraining",
      duration: 60,
      caloriesBurned: 450,
      intensity: "moderate",
    });

    expect(result).toEqual({ id: 1 });
  });

  it("lists training entries", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.training.list({});

    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Blog Management (Admin)", () => {
  it("creates a blog post as admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.blog.create({
      title: "Test Blog Post",
      slug: "test-blog-post",
      content: "This is test content.",
      category: "update",
      published: true,
    });

    expect(result).toEqual({ id: 1 });
  });

  it("lists blog posts", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.blog.list({});

    expect(Array.isArray(result)).toBe(true);
  });
});

describe("Service Inquiries", () => {
  it("creates an inquiry", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.inquiries.create({
      name: "Test User",
      email: "test@example.com",
      message: "I am interested in coaching.",
    });

    expect(result).toEqual({ id: 1 });
  });
});
