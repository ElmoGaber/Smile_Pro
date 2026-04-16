import { Router } from "express";
import { db } from "@workspace/db";
import { appointmentsTable } from "@workspace/db";

const router = Router();

function emptyAnalyticsPayload() {
  return {
    peakHours: [] as Array<{ time: string; count: number }>,
    dailyTrend: [] as Array<{ date: string; count: number }>,
    serviceBreakdown: [] as Array<{ service: string; count: number }>,
    statusBreakdown: [
      { status: "pending", count: 0 },
      { status: "confirmed", count: 0 },
      { status: "completed", count: 0 },
      { status: "cancelled", count: 0 },
    ],
  };
}

router.get("/appointments", async (req, res) => {
  try {
    const all = await db.select().from(appointmentsTable);

    // Peak hours - count appointments by preferred time
    const hourMap: Record<string, number> = {};
    for (const apt of all) {
      const t = apt.preferredTime || "Unknown";
      hourMap[t] = (hourMap[t] || 0) + 1;
    }
    const peakHours = Object.entries(hourMap)
      .map(([time, count]) => ({ time, count }))
      .sort((a, b) => b.count - a.count);

    // Daily appointments - last 30 days
    const dateMap: Record<string, number> = {};
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      dateMap[key] = 0;
    }
    for (const apt of all) {
      if (dateMap[apt.preferredDate] !== undefined) {
        dateMap[apt.preferredDate]++;
      }
    }
    const dailyTrend = Object.entries(dateMap).map(([date, count]) => ({
      date,
      count,
    }));

    // Service breakdown
    const serviceMap: Record<string, number> = {};
    for (const apt of all) {
      const s = apt.service || "Other";
      serviceMap[s] = (serviceMap[s] || 0) + 1;
    }
    const serviceBreakdown = Object.entries(serviceMap)
      .map(([service, count]) => ({ service, count }))
      .sort((a, b) => b.count - a.count);

    // Status breakdown
    const statusMap = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
    for (const apt of all) {
      if (apt.status in statusMap) {
        statusMap[apt.status as keyof typeof statusMap]++;
      }
    }
    const statusBreakdown = Object.entries(statusMap).map(([status, count]) => ({
      status,
      count,
    }));

    res.json({ peakHours, dailyTrend, serviceBreakdown, statusBreakdown });
  } catch (err) {
    req.log.error({ err }, "Failed to get analytics");
    res.json(emptyAnalyticsPayload());
  }
});

export default router;
