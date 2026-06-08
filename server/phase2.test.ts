import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): { ctx: TrpcContext } {
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

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("Phase 2: User Persistence Features", () => {
  describe("Preferences Router", () => {
    it("should get user preferences", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.preferences.get();
      expect(result).toBeDefined();
    });

    it("should update theme preference", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.preferences.updateTheme("dark");
      expect(result.success).toBe(true);
      expect(result.theme).toBe("dark");
    });

    it("should update default timezone", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.preferences.updateDefaultTimezone("America/New_York");
      expect(result.success).toBe(true);
      expect(result.timezone).toBe("America/New_York");
    });

    it("should update user profile", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.preferences.updateProfile({
        name: "Updated Name",
        email: "updated@example.com",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("Favorites Router", () => {
    it("should list user favorites", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.favorites.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should check if city is favorite", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.favorites.isFavorite({ cityId: 1 });
      expect(typeof result).toBe("boolean");
    });
  });

  describe("Meetings Router", () => {
    it("should list user meetings", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.meetings.list({ limit: 10, offset: 0 });
      expect(Array.isArray(result)).toBe(true);
    });

    it("should create a meeting invite", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.meetings.create({
        title: "Team Meeting",
        description: "Weekly sync",
        cityIds: [1, 2],
        meetingTimeUtc: new Date(),
      });

      expect(result.success).toBe(true);
      expect(result.inviteCode).toBeDefined();
      expect(result.shareUrl).toContain("/invite/");
    });
  });

  describe("Countdowns Router", () => {
    it("should list user countdowns", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.countdowns.list({ limit: 10, offset: 0 });
      expect(Array.isArray(result)).toBe(true);
    });

    it("should create a countdown", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);

      const result = await caller.countdowns.create({
        title: "Product Launch",
        targetTimeUtc: futureDate,
        timezone: "UTC",
        isPublic: true,
      });

      expect(result.success).toBe(true);
      expect(result.countdownCode).toBeDefined();
      expect(result.shareUrl).toContain("/countdown/");
    });

    it("should update countdown visibility", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.countdowns.updateVisibility({
        id: 1,
        isPublic: false,
      });

      expect(result.success).toBe(true);
    });
  });
});
