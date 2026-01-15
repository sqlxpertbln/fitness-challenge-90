import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";

// Admin check middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        avatarUrl: z.string().optional(),
        challengeStartDate: z.string().optional(),
        targetWeight: z.string().optional(),
        height: z.number().optional(),
        birthDate: z.string().optional(),
        gender: z.enum(["male", "female", "other"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserProfile(ctx.user.id, {
          ...input,
          challengeStartDate: input.challengeStartDate ? new Date(input.challengeStartDate) : undefined,
          birthDate: input.birthDate ? new Date(input.birthDate) : undefined,
        });
        return { success: true };
      }),
  }),

  // ============ SLEEP TRACKING ============
  sleep: router({
    create: protectedProcedure
      .input(z.object({
        entryDate: z.string(),
        bedTime: z.string().optional(),
        wakeTime: z.string().optional(),
        totalSleep: z.number().optional(),
        deepSleep: z.number().optional(),
        remSleep: z.number().optional(),
        lightSleep: z.number().optional(),
        awakeTime: z.number().optional(),
        sleepQuality: z.enum(["poor", "fair", "good", "excellent"]).optional(),
        sleepScore: z.number().optional(),
        avgHeartRate: z.number().optional(),
        minHeartRate: z.number().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.createSleepEntry({
          userId: ctx.user.id,
          entryDate: new Date(input.entryDate),
          bedTime: input.bedTime ? new Date(input.bedTime) : undefined,
          wakeTime: input.wakeTime ? new Date(input.wakeTime) : undefined,
          totalSleep: input.totalSleep,
          deepSleep: input.deepSleep,
          remSleep: input.remSleep,
          lightSleep: input.lightSleep,
          awakeTime: input.awakeTime,
          sleepQuality: input.sleepQuality,
          sleepScore: input.sleepScore,
          avgHeartRate: input.avgHeartRate,
          minHeartRate: input.minHeartRate,
          notes: input.notes,
        });
        return { id };
      }),
    list: protectedProcedure
      .input(z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        return db.getSleepEntries(ctx.user.id, input?.startDate, input?.endDate);
      }),
    getByDate: protectedProcedure
      .input(z.object({ date: z.string() }))
      .query(async ({ ctx, input }) => {
        return db.getSleepEntryByDate(ctx.user.id, input.date);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        totalSleep: z.number().optional(),
        deepSleep: z.number().optional(),
        remSleep: z.number().optional(),
        lightSleep: z.number().optional(),
        sleepQuality: z.enum(["poor", "fair", "good", "excellent"]).optional(),
        sleepScore: z.number().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await db.updateSleepEntry(id, ctx.user.id, data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteSleepEntry(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  // ============ BODY COMPOSITION ============
  body: router({
    create: protectedProcedure
      .input(z.object({
        entryDate: z.string(),
        weight: z.string().optional(),
        bodyFat: z.string().optional(),
        visceralFat: z.number().optional(),
        muscleMass: z.string().optional(),
        boneMass: z.string().optional(),
        bodyWater: z.string().optional(),
        bmi: z.string().optional(),
        bmr: z.number().optional(),
        metabolicAge: z.number().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.createBodyEntry({
          userId: ctx.user.id,
          entryDate: new Date(input.entryDate),
          weight: input.weight,
          bodyFat: input.bodyFat,
          visceralFat: input.visceralFat,
          muscleMass: input.muscleMass,
          boneMass: input.boneMass,
          bodyWater: input.bodyWater,
          bmi: input.bmi,
          bmr: input.bmr,
          metabolicAge: input.metabolicAge,
          notes: input.notes,
        });
        return { id };
      }),
    list: protectedProcedure
      .input(z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        return db.getBodyEntries(ctx.user.id, input?.startDate, input?.endDate);
      }),
    getByDate: protectedProcedure
      .input(z.object({ date: z.string() }))
      .query(async ({ ctx, input }) => {
        return db.getBodyEntryByDate(ctx.user.id, input.date);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        weight: z.string().optional(),
        bodyFat: z.string().optional(),
        visceralFat: z.number().optional(),
        muscleMass: z.string().optional(),
        boneMass: z.string().optional(),
        bodyWater: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await db.updateBodyEntry(id, ctx.user.id, data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteBodyEntry(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  // ============ BLOOD PRESSURE ============
  bloodPressure: router({
    create: protectedProcedure
      .input(z.object({
        entryDate: z.string(),
        measurementTime: z.string().optional(),
        systolic: z.number(),
        diastolic: z.number(),
        pulse: z.number().optional(),
        position: z.enum(["sitting", "standing", "lying"]).optional(),
        arm: z.enum(["left", "right"]).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.createBloodPressureEntry({
          userId: ctx.user.id,
          entryDate: new Date(input.entryDate),
          measurementTime: input.measurementTime ? new Date(input.measurementTime) : undefined,
          systolic: input.systolic,
          diastolic: input.diastolic,
          pulse: input.pulse,
          position: input.position,
          arm: input.arm,
          notes: input.notes,
        });
        return { id };
      }),
    list: protectedProcedure
      .input(z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        return db.getBloodPressureEntries(ctx.user.id, input?.startDate, input?.endDate);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        systolic: z.number().optional(),
        diastolic: z.number().optional(),
        pulse: z.number().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await db.updateBloodPressureEntry(id, ctx.user.id, data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteBloodPressureEntry(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  // ============ NUTRITION ============
  nutrition: router({
    create: protectedProcedure
      .input(z.object({
        entryDate: z.string(),
        mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]).optional(),
        mealTime: z.string().optional(),
        description: z.string().optional(),
        calories: z.number().optional(),
        protein: z.string().optional(),
        carbs: z.string().optional(),
        fat: z.string().optional(),
        fiber: z.string().optional(),
        sugar: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.createNutritionEntry({
          userId: ctx.user.id,
          entryDate: new Date(input.entryDate),
          mealType: input.mealType,
          mealTime: input.mealTime ? new Date(input.mealTime) : undefined,
          description: input.description,
          calories: input.calories,
          protein: input.protein,
          carbs: input.carbs,
          fat: input.fat,
          fiber: input.fiber,
          sugar: input.sugar,
          notes: input.notes,
        });
        return { id };
      }),
    list: protectedProcedure
      .input(z.object({ date: z.string().optional() }).optional())
      .query(async ({ ctx, input }) => {
        return db.getNutritionEntries(ctx.user.id, input?.date);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        description: z.string().optional(),
        calories: z.number().optional(),
        protein: z.string().optional(),
        carbs: z.string().optional(),
        fat: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await db.updateNutritionEntry(id, ctx.user.id, data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteNutritionEntry(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  // ============ WATER INTAKE ============
  water: router({
    add: protectedProcedure
      .input(z.object({
        entryDate: z.string(),
        amount: z.number(),
        entryTime: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.createWaterEntry({
          userId: ctx.user.id,
          entryDate: new Date(input.entryDate),
          amount: input.amount,
          entryTime: input.entryTime ? new Date(input.entryTime) : undefined,
        });
        return { id };
      }),
    list: protectedProcedure
      .input(z.object({ date: z.string() }))
      .query(async ({ ctx, input }) => {
        return db.getWaterEntries(ctx.user.id, input.date);
      }),
    dailyTotal: protectedProcedure
      .input(z.object({ date: z.string() }))
      .query(async ({ ctx, input }) => {
        return db.getDailyWaterTotal(ctx.user.id, input.date);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteWaterEntry(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  // ============ TRAINING ============
  training: router({
    create: protectedProcedure
      .input(z.object({
        entryDate: z.string(),
        workoutType: z.string(),
        startTime: z.string().optional(),
        duration: z.number().optional(),
        caloriesBurned: z.number().optional(),
        avgHeartRate: z.number().optional(),
        maxHeartRate: z.number().optional(),
        distance: z.string().optional(),
        steps: z.number().optional(),
        intensity: z.enum(["light", "moderate", "intense", "maximum"]).optional(),
        exercises: z.any().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.createTrainingEntry({
          userId: ctx.user.id,
          entryDate: new Date(input.entryDate),
          workoutType: input.workoutType,
          startTime: input.startTime ? new Date(input.startTime) : undefined,
          duration: input.duration,
          caloriesBurned: input.caloriesBurned,
          avgHeartRate: input.avgHeartRate,
          maxHeartRate: input.maxHeartRate,
          distance: input.distance,
          steps: input.steps,
          intensity: input.intensity,
          exercises: input.exercises,
          notes: input.notes,
        });
        return { id };
      }),
    list: protectedProcedure
      .input(z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        return db.getTrainingEntries(ctx.user.id, input?.startDate, input?.endDate);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        workoutType: z.string().optional(),
        duration: z.number().optional(),
        caloriesBurned: z.number().optional(),
        intensity: z.enum(["light", "moderate", "intense", "maximum"]).optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateTrainingEntry(input.id, ctx.user.id, {
          workoutType: input.workoutType,
          duration: input.duration,
          caloriesBurned: input.caloriesBurned,
          intensity: input.intensity,
          notes: input.notes,
        });
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteTrainingEntry(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  // ============ SAUNA ============
  sauna: router({
    create: protectedProcedure
      .input(z.object({
        entryDate: z.string(),
        saunaType: z.enum(["finnish", "infrared", "steam", "bio"]).optional(),
        duration: z.number(),
        temperature: z.number().optional(),
        rounds: z.number().optional(),
        coldPlunge: z.boolean().optional(),
        coldDuration: z.number().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.createSaunaEntry({
          userId: ctx.user.id,
          entryDate: new Date(input.entryDate),
          saunaType: input.saunaType,
          duration: input.duration,
          temperature: input.temperature,
          rounds: input.rounds,
          coldPlunge: input.coldPlunge,
          coldDuration: input.coldDuration,
          notes: input.notes,
        });
        return { id };
      }),
    list: protectedProcedure
      .input(z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        return db.getSaunaEntries(ctx.user.id, input?.startDate, input?.endDate);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        duration: z.number().optional(),
        temperature: z.number().optional(),
        rounds: z.number().optional(),
        coldPlunge: z.boolean().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        await db.updateSaunaEntry(id, ctx.user.id, data);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteSaunaEntry(input.id, ctx.user.id);
        return { success: true };
      }),
  }),

  // ============ DAILY SUMMARY ============
  dailySummary: router({
    save: protectedProcedure
      .input(z.object({
        entryDate: z.string(),
        mood: z.enum(["terrible", "bad", "okay", "good", "great"]).optional(),
        energyLevel: z.number().optional(),
        stressLevel: z.number().optional(),
        goalsAchieved: z.number().optional(),
        totalGoals: z.number().optional(),
        gratitude: z.string().optional(),
        wins: z.string().optional(),
        challenges: z.string().optional(),
        tomorrowFocus: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.createOrUpdateDailySummary({
          userId: ctx.user.id,
          entryDate: new Date(input.entryDate),
          mood: input.mood,
          energyLevel: input.energyLevel,
          stressLevel: input.stressLevel,
          goalsAchieved: input.goalsAchieved,
          totalGoals: input.totalGoals,
          gratitude: input.gratitude,
          wins: input.wins,
          challenges: input.challenges,
          tomorrowFocus: input.tomorrowFocus,
          notes: input.notes,
        });
        return { id };
      }),
    get: protectedProcedure
      .input(z.object({ date: z.string() }))
      .query(async ({ ctx, input }) => {
        return db.getDailySummary(ctx.user.id, input.date);
      }),
    list: protectedProcedure
      .input(z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        return db.getDailySummaries(ctx.user.id, input?.startDate, input?.endDate);
      }),
  }),

  // ============ BLOG ============
  blog: router({
    list: publicProcedure
      .input(z.object({ publishedOnly: z.boolean().optional() }).optional())
      .query(async ({ input }) => {
        return db.getBlogPosts(input?.publishedOnly ?? true);
      }),
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return db.getBlogPostBySlug(input.slug);
      }),
    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getBlogPostById(input.id);
      }),
    create: adminProcedure
      .input(z.object({
        title: z.string(),
        slug: z.string(),
        excerpt: z.string().optional(),
        content: z.string(),
        category: z.enum(["update", "tips", "progress", "nutrition", "training", "mindset"]).optional(),
        featuredImageUrl: z.string().optional(),
        videoUrl: z.string().optional(),
        published: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.createBlogPost({
          authorId: ctx.user.id,
          title: input.title,
          slug: input.slug,
          excerpt: input.excerpt,
          content: input.content,
          category: input.category,
          featuredImageUrl: input.featuredImageUrl,
          videoUrl: input.videoUrl,
          published: input.published,
          publishedAt: input.published ? new Date() : undefined,
        });
        return { id };
      }),
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        slug: z.string().optional(),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        category: z.enum(["update", "tips", "progress", "nutrition", "training", "mindset"]).optional(),
        featuredImageUrl: z.string().optional(),
        videoUrl: z.string().optional(),
        published: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, published, ...data } = input;
        await db.updateBlogPost(id, {
          ...data,
          published,
          publishedAt: published ? new Date() : undefined,
        });
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteBlogPost(input.id);
        return { success: true };
      }),
  }),

  // ============ SERVICES ============
  services: router({
    list: publicProcedure
      .input(z.object({ activeOnly: z.boolean().optional() }).optional())
      .query(async ({ input }) => {
        return db.getServices(input?.activeOnly ?? true);
      }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getServiceById(input.id);
      }),
    create: adminProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        features: z.array(z.string()).optional(),
        price: z.string().optional(),
        currency: z.string().optional(),
        billingPeriod: z.enum(["once", "monthly", "yearly"]).optional(),
        category: z.enum(["coaching", "membership", "program"]).optional(),
        isActive: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createService({
          name: input.name,
          description: input.description,
          features: input.features ? JSON.stringify(input.features) : undefined,
          price: input.price,
          currency: input.currency,
          billingPeriod: input.billingPeriod,
          category: input.category,
          isActive: input.isActive,
          sortOrder: input.sortOrder,
        });
        return { id };
      }),
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        features: z.array(z.string()).optional(),
        price: z.string().optional(),
        isActive: z.boolean().optional(),
        sortOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, features, ...data } = input;
        await db.updateService(id, {
          ...data,
          features: features ? JSON.stringify(features) : undefined,
        });
        return { success: true };
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteService(input.id);
        return { success: true };
      }),
  }),

  // ============ DATA EXPORT ============
  export: router({
    all: protectedProcedure
      .input(z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }).optional())
      .query(async ({ ctx, input }) => {
        const [sleep, body, bloodPressure, nutrition, water, training, sauna] = await Promise.all([
          db.getSleepEntries(ctx.user.id, input?.startDate, input?.endDate),
          db.getBodyEntries(ctx.user.id, input?.startDate, input?.endDate),
          db.getBloodPressureEntries(ctx.user.id, input?.startDate, input?.endDate),
          db.getNutritionEntries(ctx.user.id, input?.startDate),
          db.getWaterEntries(ctx.user.id, input?.startDate || new Date().toISOString().split('T')[0]),
          db.getTrainingEntries(ctx.user.id, input?.startDate, input?.endDate),
          db.getSaunaEntries(ctx.user.id, input?.startDate, input?.endDate),
        ]);
        return { sleep, body, bloodPressure, nutrition, water, training, sauna };
      }),
  }),

  // ============ INQUIRIES ============
  inquiries: router({
    create: publicProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().email(),
        phone: z.string().optional(),
        serviceId: z.number().optional(),
        message: z.string(),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createInquiry(input);
        return { id };
      }),
    list: adminProcedure.query(async () => {
      return db.getInquiries();
    }),
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "contacted", "closed"]),
      }))
      .mutation(async ({ input }) => {
        await db.updateInquiryStatus(input.id, input.status);
        return { success: true };
      }),
  }),

  // ============ USER GOALS ============
  goals: router({
    create: protectedProcedure
      .input(z.object({
        goalType: z.enum(["weight", "water", "sleep", "training", "calories", "steps", "body_fat"]),
        targetValue: z.number(),
        startValue: z.number().optional(),
        currentValue: z.number().optional(),
        unit: z.string(),
        startDate: z.string(),
        targetDate: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.createUserGoal({
          userId: ctx.user.id,
          goalType: input.goalType,
          targetValue: input.targetValue.toString(),
          startValue: input.startValue?.toString(),
          currentValue: input.currentValue?.toString(),
          unit: input.unit,
          startDate: new Date(input.startDate),
          targetDate: input.targetDate ? new Date(input.targetDate) : undefined,
          notes: input.notes,
        });
        return { id };
      }),
    list: protectedProcedure
      .input(z.object({ activeOnly: z.boolean().optional() }).optional())
      .query(async ({ ctx, input }) => {
        return db.getUserGoals(ctx.user.id, input?.activeOnly ?? true);
      }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getUserGoalById(input.id, ctx.user.id);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        targetValue: z.number().optional(),
        currentValue: z.number().optional(),
        targetDate: z.string().optional(),
        isActive: z.boolean().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserGoal(input.id, ctx.user.id, {
          targetValue: input.targetValue?.toString(),
          currentValue: input.currentValue?.toString(),
          targetDate: input.targetDate ? new Date(input.targetDate) : undefined,
          isActive: input.isActive,
          notes: input.notes,
        });
        return { success: true };
      }),
    complete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.completeUserGoal(input.id, ctx.user.id);
        return { success: true };
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.deleteUserGoal(input.id, ctx.user.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
