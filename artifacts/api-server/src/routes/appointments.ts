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

type AppointmentResponse = {
  id: number;
  patientName: string;
  patientPhone: string;
  patientEmail: string | null;
  service: string;
  preferredDate: string;
  preferredTime: string;
  notes: string | null;
  status: string;
  createdAt: string;
};

let fallbackAppointments: AppointmentResponse[] = [];
let fallbackAppointmentId = 1;

function listFallbackAppointments() {
  return [...fallbackAppointments].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

router.get("/", async (req, res) => {
  try {
    const appointments = await db
      .select()
      .from(appointmentsTable)
      .orderBy(desc(appointmentsTable.createdAt));
    res.json(appointments.map(formatAppointment));
  } catch (err) {
    req.log.warn({ err }, "Failed to list appointments from DB, using in-memory fallback");
    res.json(listFallbackAppointments());
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
    req.log.warn({ err }, "Failed to list upcoming appointments from DB, using in-memory fallback");
    const today = new Date().toISOString().split("T")[0];
    res.json(
      listFallbackAppointments().filter(
        (appt) => appt.preferredDate >= today && appt.status === "confirmed",
      ),
    );
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
    req.log.warn({ err }, "Failed to get appointment from DB, using in-memory fallback");
    const appt = fallbackAppointments.find((item) => item.id === parsed.data.id);
    if (!appt) return res.status(404).json({ error: "Not found" });
    res.json(appt);
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
    req.log.warn({ err }, "Failed to create appointment in DB, using in-memory fallback");
    const created: AppointmentResponse = {
      id: fallbackAppointmentId++,
      patientName: parsed.data.patientName,
      patientPhone: parsed.data.patientPhone,
      patientEmail: parsed.data.patientEmail ?? null,
      service: parsed.data.service,
      preferredDate: parsed.data.preferredDate,
      preferredTime: parsed.data.preferredTime,
      notes: parsed.data.notes ?? null,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    fallbackAppointments = [created, ...fallbackAppointments];
    res.status(201).json(created);
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
    req.log.warn({ err }, "Failed to update appointment in DB, using in-memory fallback");
    const index = fallbackAppointments.findIndex((item) => item.id === paramsParsed.data.id);
    if (index === -1) return res.status(404).json({ error: "Not found" });
    fallbackAppointments[index] = {
      ...fallbackAppointments[index],
      status: bodyParsed.data.status,
    };
    res.json(fallbackAppointments[index]);
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
