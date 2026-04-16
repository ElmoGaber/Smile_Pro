import { Router } from "express";
import { db } from "@workspace/db";
import { appointmentsTable } from "@workspace/db";
import { eq, desc, gte, and } from "drizzle-orm";
import {
  CreateAppointmentBody,
  GetAppointmentParams,
  UpdateAppointmentStatusParams,
  UpdateAppointmentStatusBody,
} from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const appointments = await db
      .select()
      .from(appointmentsTable)
      .orderBy(desc(appointmentsTable.createdAt));
    res.json(appointments.map(formatAppointment));
  } catch (err) {
    req.log.error({ err }, "Failed to list appointments");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/upcoming", async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const upcoming = await db
      .select()
      .from(appointmentsTable)
      .where(
        and(
          gte(appointmentsTable.preferredDate, today),
          eq(appointmentsTable.status, "confirmed"),
        ),
      )
      .orderBy(appointmentsTable.preferredDate);
    res.json(upcoming.map(formatAppointment));
  } catch (err) {
    req.log.error({ err }, "Failed to list upcoming appointments");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const parsed = GetAppointmentParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  try {
    const [appt] = await db
      .select()
      .from(appointmentsTable)
      .where(eq(appointmentsTable.id, parsed.data.id));
    if (!appt) return res.status(404).json({ error: "Not found" });
    res.json(formatAppointment(appt));
  } catch (err) {
    req.log.error({ err }, "Failed to get appointment");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  const parsed = CreateAppointmentBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
  }
  try {
    const [created] = await db
      .insert(appointmentsTable)
      .values({
        patientName: parsed.data.patientName,
        patientPhone: parsed.data.patientPhone,
        patientEmail: parsed.data.patientEmail ?? null,
        service: parsed.data.service,
        preferredDate: parsed.data.preferredDate,
        preferredTime: parsed.data.preferredTime,
        notes: parsed.data.notes ?? null,
        status: "pending",
      })
      .returning();
    res.status(201).json(formatAppointment(created));
  } catch (err) {
    req.log.error({ err }, "Failed to create appointment");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/:id", async (req, res) => {
  const paramsParsed = UpdateAppointmentStatusParams.safeParse({ id: Number(req.params.id) });
  if (!paramsParsed.success) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  const bodyParsed = UpdateAppointmentStatusBody.safeParse(req.body);
  if (!bodyParsed.success) {
    return res.status(400).json({ error: "Invalid input" });
  }
  try {
    const [updated] = await db
      .update(appointmentsTable)
      .set({ status: bodyParsed.data.status })
      .where(eq(appointmentsTable.id, paramsParsed.data.id))
      .returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(formatAppointment(updated));
  } catch (err) {
    req.log.error({ err }, "Failed to update appointment");
    res.status(500).json({ error: "Internal server error" });
  }
});

function formatAppointment(appt: typeof appointmentsTable.$inferSelect) {
  return {
    id: appt.id,
    patientName: appt.patientName,
    patientPhone: appt.patientPhone,
    patientEmail: appt.patientEmail ?? null,
    service: appt.service,
    preferredDate: appt.preferredDate,
    preferredTime: appt.preferredTime,
    notes: appt.notes ?? null,
    status: appt.status,
    createdAt: appt.createdAt.toISOString(),
  };
}

export default router;
