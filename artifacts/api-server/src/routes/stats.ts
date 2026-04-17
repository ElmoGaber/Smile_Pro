import { Router } from "express";
import { db } from "@workspace/db";
import { appointmentsTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";

const router = Router();

router.get("/overview", async (req, res) => {
  try {
    const all = await db.select().from(appointmentsTable);
    const today = new Date().toISOString().split("T")[0];

    const totalAppointments = all.length;
    const pendingAppointments = all.filter((a) => a.status === "pending").length;
    const confirmedAppointments = all.filter((a) => a.status === "confirmed").length;
    const completedAppointments = all.filter((a) => a.status === "completed").length;
    const todayAppointments = all.filter((a) => a.preferredDate === today).length;

    res.json({
      totalAppointments,
      pendingAppointments,
      confirmedAppointments,
      completedAppointments,
      todayAppointments,
      happyPatients: Math.max(500 + completedAppointments, 500),
      yearsExperience: 12,
    });
  } catch (err) {
    req.log.warn({ err }, "Failed to get stats from DB, returning fallback values");
    res.json({
      totalAppointments: 0,
      pendingAppointments: 0,
      confirmedAppointments: 0,
      completedAppointments: 0,
      todayAppointments: 0,
      happyPatients: 500,
      yearsExperience: 12,
    });
  }
});

export default router;
