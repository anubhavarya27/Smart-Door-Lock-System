/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { db } from "@/server/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; secret: string }> },
) {
  const { id, secret } = await params;

  // Validate the secret
  const device = await db.device.findUnique({
    where: { id },
  });
  if (!device?.secret || device.secret !== secret) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { status } = await request.json();
  await db.record.create({
    data: {
      deviceId: id,
      Open: !!status,
    },
  });
  return new Response("Record added", { status: 201 });
}
