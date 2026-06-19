"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Lock, LockOpen } from "lucide-react";
import { api } from "@/trpc/react";

export interface DeviceCardProps {
  id: string;
  name: string;
  createdAt: Date | string;
}

export function DeviceCard({ id, name, createdAt }: DeviceCardProps) {
  const {
    data: records,
    isLoading,
    error,
  } = api.device.getDeviceRecords.useQuery(
    {
      deviceId: id,
    },
    {
      refetchOnWindowFocus: false,
      refetchInterval: 3000,
    },
  );

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getLockStatus = (isOpen: boolean) => {
    return isOpen ? "Accepted" : "Rejected";
  };

  const getLockStatusColor = (isOpen: boolean) => {
    return isOpen
      ? "text-green-500 bg-green-500/10"
      : "text-red-500 bg-red-500/10";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{name}</CardTitle>
            <p className="text-muted-foreground mt-1 text-sm">
              Created on {formatDate(createdAt)}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-muted-foreground ml-2">
              Loading records...
            </span>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">
            Error loading records: {error.message}
          </div>
        ) : records && records.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Status</TableHead>
                  <TableHead>Lock Status</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {record.Open ? (
                        <LockOpen className="h-4 w-4 text-green-500" />
                      ) : (
                        <Lock className="h-4 w-4 text-red-500" />
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getLockStatusColor(
                          record.Open,
                        )}`}
                      >
                        {getLockStatus(record.Open)}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(record.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-muted-foreground py-8 text-center">
            No records found for this device.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
