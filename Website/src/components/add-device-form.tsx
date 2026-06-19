"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useState } from "react";
import { addDeviceSchema } from "@/schema/add-device";
import { api } from "@/trpc/react";

type AddDeviceFormValues = z.infer<typeof addDeviceSchema>;

export function AddDeviceForm() {
  const [error, setError] = useState(false);
  // const utils = api.useUtils();
  const addDeviceMutation = api.device.addDevice.useMutation({
    onSuccess() {
      toast.success("Device added successfully!");
      form.reset();
      // void utils.user.ownedDevices.invalidate();
    },
    onError() {
      toast.error("Failed to add device. Please try again.");
      setError(true);
    },
  });

  const form = useForm<AddDeviceFormValues>({
    resolver: zodResolver(addDeviceSchema),
    defaultValues: {
      deviceName: "",
      deviceId: "",
      deviceSecret: "",
    },
  });

  async function onSubmit(data: AddDeviceFormValues) {
    setError(false);
    await addDeviceMutation.mutateAsync(data);
  }

  return (
    <Card className="m-10 w-2/3 border-0">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-blue-500 shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary-foreground"
          >
            <path d="M12 2v20" />
            <path d="M2 12h20" />
          </svg>
        </div>
        <CardTitle className="text-xl font-semibold tracking-tight">
          Add New Device
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your Device credentials to add it to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-5"
          >
            <FormField
              control={form.control}
              name="deviceName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter device name"
                      className="h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter device ID"
                      className="h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deviceSecret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device Secret</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter device secret"
                      className="h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error && (
              <p className="w-full text-center font-bold text-red-500">
                Failed to add device. Please check your credentials and try
                again.
              </p>
            )}
            <Button
              type="submit"
              size="lg"
              className="mt-1 w-full bg-gradient-to-tr from-indigo-500 to-blue-500 shadow-lg"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="size-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Adding device...
                </span>
              ) : (
                "Add Device"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
