import { db } from "@/server/db";

export async function GET() {
  await db.device.create({
    data: {
      name: "Test Device",
    },
  });

  return new Response("Bridge added");
}
