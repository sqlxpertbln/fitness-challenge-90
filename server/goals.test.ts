import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

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
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createUnauthContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("goals router", () => {
  describe("goals.list", () => {
    it("requires authentication", async () => {
      const ctx = createUnauthContext();
      const caller = appRouter.createCaller(ctx);
      
      await expect(caller.goals.list()).rejects.toThrow("Please login");
    });
  });

  describe("goals.create input validation", () => {
    it("validates goalType enum", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      
      // Test that valid goalTypes are accepted (will fail at DB level but pass validation)
      const validGoalTypes = ["weight", "water", "sleep", "training", "calories", "steps", "body_fat"];
      
      for (const goalType of validGoalTypes) {
        // This should not throw a validation error
        try {
          await caller.goals.create({
            goalType: goalType as any,
            targetValue: 75,
            unit: "kg",
            startDate: "2026-01-15",
          });
        } catch (e: any) {
          // We expect DB errors, not validation errors
          expect(e.code).not.toBe("BAD_REQUEST");
        }
      }
    });

    it("requires targetValue", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      
      await expect(caller.goals.create({
        goalType: "weight",
        targetValue: undefined as any,
        unit: "kg",
        startDate: "2026-01-15",
      })).rejects.toThrow();
    });

    it("requires unit", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      
      await expect(caller.goals.create({
        goalType: "weight",
        targetValue: 75,
        unit: undefined as any,
        startDate: "2026-01-15",
      })).rejects.toThrow();
    });

    it("requires startDate", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      
      await expect(caller.goals.create({
        goalType: "weight",
        targetValue: 75,
        unit: "kg",
        startDate: undefined as any,
      })).rejects.toThrow();
    });
  });

  describe("goals.update input validation", () => {
    it("requires id", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);
      
      await expect(caller.goals.update({
        id: undefined as any,
        currentValue: 80,
      })).rejects.toThrow();
    });
  });

  describe("goals.complete", () => {
    it("requires authentication", async () => {
      const ctx = createUnauthContext();
      const caller = appRouter.createCaller(ctx);
      
      await expect(caller.goals.complete({ id: 1 })).rejects.toThrow("Please login");
    });
  });

  describe("goals.delete", () => {
    it("requires authentication", async () => {
      const ctx = createUnauthContext();
      const caller = appRouter.createCaller(ctx);
      
      await expect(caller.goals.delete({ id: 1 })).rejects.toThrow("Please login");
    });
  });
});
