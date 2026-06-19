import { api } from "@/trpc/server";
import { DeviceCard } from "@/components/device-card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Dashboard() {
  const devices = await api.device.getDevices();

  return (
    <div className="from-background via-background to-muted/20 min-h-screen bg-gradient-to-br p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
            Connected Devices
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage and monitor all your connected devices
          </p>
        </div>

        {/* Devices Grid */}
        {devices.length > 0 ? (
          <div className="gap-y-6">
            {devices.map((device) => (
              <DeviceCard
                key={device.id}
                id={device.id}
                name={device.name}
                createdAt={device.createdAt}
              />
            ))}
          </div>
        ) : (
          <div className="border-muted-foreground/20 bg-muted/10 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-16">
            <div className="bg-primary/10 mb-4 rounded-full p-4">
              <Plus className="text-primary h-8 w-8" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">No devices connected</h3>
            <p className="text-muted-foreground mb-6 max-w-sm text-center">
              Start by adding a new device to see it appear here. You can manage
              and control all your devices from this dashboard.
            </p>
            <Button asChild>
              <Link href="/add">
                <Plus className="mr-2 h-4 w-4" />
                Add Device
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
