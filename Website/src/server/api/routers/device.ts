import { createTRPCRouter, protectedProcedure } from "../trpc";
import z from "zod";
import { addDeviceSchema } from "@/schema/add-device";

// await prisma.$queryRaw`
//   SELECT *
//   FROM (
//     SELECT *, ROW_NUMBER() OVER (ORDER BY id) as rn
//     FROM "YourModelName"
//   ) AS subquery
//   WHERE rn % ${n} = 0;
// `;

export const deviceRouter = createTRPCRouter({
  addDevice: protectedProcedure
    .input(addDeviceSchema)
    .mutation(async ({ ctx, input }) => {
      const { deviceName, deviceId, deviceSecret } = input;

      const device = await ctx.db.device.findFirst({
        where: {
          id: deviceId,
          secret: deviceSecret,
        },
      });

      if (!device) throw new Error("Device not found");

      if (device.userId) throw new Error("Bridge already registered");

      await ctx.db.device.update({
        where: {
          id: deviceId,
        },
        data: {
          name: deviceName,
          userId: ctx.session.user.id,
        },
      });

      return {
        success: true,
      };
    }),

  getDevices: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.device.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  getDeviceRecords: protectedProcedure
    .input(
      z.object({
        deviceId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { deviceId } = input;

      const device = await ctx.db.device.findUnique({
        where: { id: deviceId },
      });

      if (!device?.userId || device.userId !== ctx.session.user.id) {
        throw new Error("Device not found or unauthorized");
      }

      return await ctx.db.record.findMany({
        where: {
          deviceId: deviceId,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      });
    }),
});
