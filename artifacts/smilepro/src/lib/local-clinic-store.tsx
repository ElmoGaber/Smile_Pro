import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";
export type UpdateAppointmentStatusBodyStatus = AppointmentStatus;

export interface LocalPromotion {
  id: number;
  titleAr: string;
  titleEn: string;
  discount: string;
  descriptionAr: string;
  descriptionEn: string;
  isActive: boolean;
}

export interface LocalAppointment {
  id: number;
  patientName: string;
  patientPhone: string;
  patientEmail: string | null;
  service: string;
  preferredDate: string;
  preferredTime: string;
  notes: string | null;
  status: AppointmentStatus;
  createdAt: string;
}

export interface LocalClinicStats {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  todayAppointments: number;
  happyPatients: number;
  yearsExperience: number;
}

export interface LocalAnalytics {
  peakHours: { time: string; count: number }[];
  dailyTrend: { date: string; count: number }[];
  serviceBreakdown: { service: string; count: number }[];
  statusBreakdown: { status: string; count: number }[];
}

interface PromotionInput {
  titleAr: string;
  titleEn: string;
  discount: string;
  descriptionAr: string;
  descriptionEn: string;
  isActive: boolean;
}

interface AppointmentInput {
  patientName: string;
  patientPhone: string;
  patientEmail: string | null;
  service: string;
  preferredDate: string;
  preferredTime: string;
  notes: string | null;
}

interface PersistedState {
  appointments: LocalAppointment[];
  promotions: LocalPromotion[];
}

interface LocalClinicStoreValue {
  appointments: LocalAppointment[];
  promotions: LocalPromotion[];
  activePromotions: LocalPromotion[];
  stats: LocalClinicStats;
  analytics: LocalAnalytics;
  createAppointment: (input: AppointmentInput) => LocalAppointment;
  updateAppointmentStatus: (id: number, status: UpdateAppointmentStatusBodyStatus) => void;
  upsertPromotion: (input: PromotionInput, id?: number | null) => LocalPromotion;
  deletePromotion: (id: number) => void;
  togglePromotion: (id: number) => void;
}

const STORE_KEY = "smilepro.local.clinic-store.v1";
const BASE_HAPPY_PATIENTS = 500;
const DEFAULT_YEARS_EXPERIENCE = 12;

const LocalClinicStoreContext = createContext<LocalClinicStoreValue | null>(null);

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isAppointment(value: unknown): value is LocalAppointment {
  if (!isObject(value)) return false;

  return (
    typeof value.id === "number" &&
    typeof value.patientName === "string" &&
    typeof value.patientPhone === "string" &&
    (typeof value.patientEmail === "string" || value.patientEmail === null) &&
    typeof value.service === "string" &&
    typeof value.preferredDate === "string" &&
    typeof value.preferredTime === "string" &&
    (typeof value.notes === "string" || value.notes === null) &&
    (value.status === "pending" ||
      value.status === "confirmed" ||
      value.status === "completed" ||
      value.status === "cancelled") &&
    typeof value.createdAt === "string"
  );
}

function isPromotion(value: unknown): value is LocalPromotion {
  if (!isObject(value)) return false;

  return (
    typeof value.id === "number" &&
    typeof value.titleAr === "string" &&
    typeof value.titleEn === "string" &&
    typeof value.discount === "string" &&
    typeof value.descriptionAr === "string" &&
    typeof value.descriptionEn === "string" &&
    typeof value.isActive === "boolean"
  );
}

function parsePersistedState(raw: string): PersistedState {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!isObject(parsed)) {
      return { appointments: [], promotions: [] };
    }

    const appointments = Array.isArray(parsed.appointments)
      ? parsed.appointments.filter(isAppointment)
      : [];

    const promotions = Array.isArray(parsed.promotions)
      ? parsed.promotions.filter(isPromotion)
      : [];

    return { appointments, promotions };
  } catch {
    return { appointments: [], promotions: [] };
  }
}

function loadInitialState(): PersistedState {
  if (typeof window === "undefined") {
    return { appointments: [], promotions: [] };
  }

  const stored = window.localStorage.getItem(STORE_KEY);
  if (!stored) {
    return { appointments: [], promotions: [] };
  }

  return parsePersistedState(stored);
}

function saveStateToStorage(state: PersistedState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

function nextId(items: Array<{ id: number }>): number {
  return items.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1;
}

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildStats(appointments: LocalAppointment[]): LocalClinicStats {
  const todayKey = toDateKey(new Date());

  const pendingAppointments = appointments.filter((a) => a.status === "pending").length;
  const confirmedAppointments = appointments.filter((a) => a.status === "confirmed").length;
  const completedAppointments = appointments.filter((a) => a.status === "completed").length;
  const todayAppointments = appointments.filter((a) => a.preferredDate === todayKey).length;

  return {
    totalAppointments: appointments.length,
    pendingAppointments,
    confirmedAppointments,
    completedAppointments,
    todayAppointments,
    happyPatients: BASE_HAPPY_PATIENTS + completedAppointments,
    yearsExperience: DEFAULT_YEARS_EXPERIENCE,
  };
}

function buildAnalytics(appointments: LocalAppointment[]): LocalAnalytics {
  const peakHourMap = new Map<string, number>();
  const dailyMap = new Map<string, number>();
  const serviceMap = new Map<string, number>();
  const statusMap = new Map<AppointmentStatus, number>([
    ["pending", 0],
    ["confirmed", 0],
    ["completed", 0],
    ["cancelled", 0],
  ]);

  for (const appointment of appointments) {
    peakHourMap.set(appointment.preferredTime, (peakHourMap.get(appointment.preferredTime) ?? 0) + 1);
    dailyMap.set(appointment.preferredDate, (dailyMap.get(appointment.preferredDate) ?? 0) + 1);
    serviceMap.set(appointment.service, (serviceMap.get(appointment.service) ?? 0) + 1);
    statusMap.set(appointment.status, (statusMap.get(appointment.status) ?? 0) + 1);
  }

  const peakHours = Array.from(peakHourMap.entries())
    .map(([time, count]) => ({ time, count }))
    .sort((a, b) => b.count - a.count || a.time.localeCompare(b.time));

  const dailyTrend = Array.from(dailyMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const serviceBreakdown = Array.from(serviceMap.entries())
    .map(([service, count]) => ({ service, count }))
    .sort((a, b) => b.count - a.count || a.service.localeCompare(b.service));

  const statusBreakdown = (["pending", "confirmed", "completed", "cancelled"] as const).map((status) => ({
    status,
    count: statusMap.get(status) ?? 0,
  }));

  return {
    peakHours,
    dailyTrend,
    serviceBreakdown,
    statusBreakdown,
  };
}

function normalizePromotionInput(input: PromotionInput): PromotionInput {
  return {
    titleAr: input.titleAr.trim(),
    titleEn: input.titleEn.trim(),
    discount: input.discount.trim(),
    descriptionAr: input.descriptionAr.trim(),
    descriptionEn: input.descriptionEn.trim(),
    isActive: input.isActive,
  };
}

export function LocalClinicStoreProvider({ children }: { children: ReactNode }) {
  const initialStateRef = useRef<PersistedState | null>(null);
  if (initialStateRef.current === null) {
    initialStateRef.current = loadInitialState();
  }

  const [appointments, setAppointments] = useState<LocalAppointment[]>(initialStateRef.current.appointments);
  const [promotions, setPromotions] = useState<LocalPromotion[]>(initialStateRef.current.promotions);

  useEffect(() => {
    saveStateToStorage({ appointments, promotions });
  }, [appointments, promotions]);

  const createAppointment = (input: AppointmentInput): LocalAppointment => {
    const normalized: LocalAppointment = {
      id: nextId(appointments),
      patientName: input.patientName.trim(),
      patientPhone: input.patientPhone.trim(),
      patientEmail: input.patientEmail ? input.patientEmail.trim() : null,
      service: input.service.trim(),
      preferredDate: input.preferredDate,
      preferredTime: input.preferredTime.trim(),
      notes: input.notes ? input.notes.trim() : null,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setAppointments((prev) => [...prev, normalized]);
    return normalized;
  };

  const updateAppointmentStatus = (id: number, status: UpdateAppointmentStatusBodyStatus) => {
    setAppointments((prev) =>
      prev.map((appointment) =>
        appointment.id === id
          ? {
              ...appointment,
              status,
            }
          : appointment,
      ),
    );
  };

  const upsertPromotion = (input: PromotionInput, id?: number | null): LocalPromotion => {
    const normalizedInput = normalizePromotionInput(input);

    if (id && promotions.some((promotion) => promotion.id === id)) {
      const updated: LocalPromotion = { id, ...normalizedInput };
      setPromotions((prev) => prev.map((promotion) => (promotion.id === id ? updated : promotion)));
      return updated;
    }

    const created: LocalPromotion = {
      id: nextId(promotions),
      ...normalizedInput,
    };

    setPromotions((prev) => [created, ...prev]);
    return created;
  };

  const deletePromotion = (id: number) => {
    setPromotions((prev) => prev.filter((promotion) => promotion.id !== id));
  };

  const togglePromotion = (id: number) => {
    setPromotions((prev) =>
      prev.map((promotion) =>
        promotion.id === id
          ? {
              ...promotion,
              isActive: !promotion.isActive,
            }
          : promotion,
      ),
    );
  };

  const activePromotions = useMemo(
    () => promotions.filter((promotion) => promotion.isActive),
    [promotions],
  );

  const stats = useMemo(() => buildStats(appointments), [appointments]);
  const analytics = useMemo(() => buildAnalytics(appointments), [appointments]);

  const value: LocalClinicStoreValue = {
    appointments,
    promotions,
    activePromotions,
    stats,
    analytics,
    createAppointment,
    updateAppointmentStatus,
    upsertPromotion,
    deletePromotion,
    togglePromotion,
  };

  return <LocalClinicStoreContext.Provider value={value}>{children}</LocalClinicStoreContext.Provider>;
}

export function useLocalClinicStore(): LocalClinicStoreValue {
  const context = useContext(LocalClinicStoreContext);
  if (!context) {
    throw new Error("useLocalClinicStore must be used inside LocalClinicStoreProvider");
  }

  return context;
}
