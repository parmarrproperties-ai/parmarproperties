"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DashboardBreakdown } from "@/lib/api/dashboard";
import {
  getInventoryStatusLabel,
  getPropertyStatusLabel,
  getPropertyTypeLabel,
} from "@/lib/constants";
import type { InventoryStatus } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/shared/states";

const pieColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid var(--border)",
  backgroundColor: "var(--popover)",
  color: "var(--popover-foreground)",
  fontSize: 12,
};

export function DashboardCharts({
  breakdown,
}: {
  breakdown: DashboardBreakdown;
}) {
  const statusData = breakdown.byStatus.map((row) => ({
    name: getPropertyStatusLabel(row.status),
    count: row.count,
  }));

  const typeData = breakdown.byType.map((row) => ({
    name: getPropertyTypeLabel(row.type),
    value: row.count,
  }));

  const inventoryData = (
    Object.entries(breakdown.inventory) as [InventoryStatus, number][]
  ).map(([status, count]) => ({
    name: getInventoryStatusLabel(status),
    count,
  }));

  const hasInventory = inventoryData.some((row) => row.count > 0);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Properties by status</CardTitle>
          <CardDescription>
            Every listing that has not been deleted.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          {statusData.length === 0 ? (
            <EmptyState
              title="No properties yet"
              description="Status distribution appears once you add your first listing."
            />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData} margin={{ left: -20, top: 8 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  interval={0}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: "var(--muted)" }}
                />
                <Bar
                  dataKey="count"
                  name="Properties"
                  fill="var(--chart-1)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={56}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Property mix</CardTitle>
          <CardDescription>Share of each property type.</CardDescription>
        </CardHeader>
        <CardContent className="h-72">
          {typeData.length === 0 ? (
            <EmptyState
              title="No data yet"
              description="Add listings to see the mix."
            />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={44}
                  outerRadius={72}
                  paddingAngle={2}
                >
                  {typeData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
                <Legend
                  verticalAlign="bottom"
                  height={48}
                  wrapperStyle={{ fontSize: 11 }}
                />
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Inventory pipeline</CardTitle>
          <CardDescription>
            Units across every property, grouped by sales status.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-64">
          {!hasInventory ? (
            <EmptyState
              title="No units recorded"
              description="Add inventory on a property to track availability here."
            />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={inventoryData}
                layout="vertical"
                margin={{ left: 8, right: 16 }}
              >
                <CartesianGrid horizontal={false} stroke="var(--border)" />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={80}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: "var(--muted)" }}
                />
                <Bar dataKey="count" name="Units" radius={[0, 6, 6, 0]}>
                  {inventoryData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
