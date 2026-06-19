import z from "zod";

export const addDeviceSchema = z.object({
  deviceName: z
    .string()
    .min(1, "Device name is required")
    .min(3, "Device name must be at least 3 characters"),
  deviceId: z
    .string()
    .min(1, "Device ID is required")
    .min(5, "Device ID must be at least 5 characters"),
  deviceSecret: z
    .string()
    .min(1, "Device secret is required")
    .min(3, "Device secret must be at least 3 characters"),
});
