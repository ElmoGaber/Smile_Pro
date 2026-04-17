import { useI18n } from "@/lib/i18n";
import {
  useListAppointments,
  useGetClinicStats,
  useUpdateAppointmentStatus,
  getListAppointmentsQueryKey,
  type UpdateAppointmentStatusBodyStatus,
} from "@workspace/api-client-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  MoreHorizontal, CalendarCheck, CheckCircle2, Clock, CalendarDays,
  LogOut, Users, BarChart3, Tag, Plus, Trash2, Edit3, ToggleLeft, ToggleRight
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ApiRequestError, extractApiErrorMessage, requestApiJson } from "@/lib/api-request";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

interface AdminProps { onLogout: () => void; }
type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";
type Tab = "overview" | "appointments" | "analytics" | "promotions";

interface Promo {
  id?: number;
  titleAr: string;
  titleEn: string;
  discount: string;
  descriptionAr: string;
  descriptionEn: string;
  isActive: boolean;
}

interface Analytics {
  peakHours: { time: string; count: number }[];
  dailyTrend: { date: string; count: number }[];
  serviceBreakdown: { service: string; count: number }[];
  statusBreakdown: { status: string; count: number }[];
}

const PIE_COLORS = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444"];

function toSafeNumber(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function emptyAnalytics(): Analytics {
  return {
    peakHours: [],
    dailyTrend: [],
    serviceBreakdown: [],
    statusBreakdown: [
      { status: "pending", count: 0 },
      { status: "confirmed", count: 0 },
      { status: "completed", count: 0 },
      { status: "cancelled", count: 0 },
    ],
  };
}

function normalizeAnalytics(payload: unknown): Analytics {
  if (!payload || typeof payload !== "object") return emptyAnalytics();

  const source = payload as Record<string, unknown>;

  const peakHours = Array.isArray(source.peakHours)
    ? source.peakHours
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const row = item as Record<string, unknown>;
          return {
            time: typeof row.time === "string" ? row.time : "Unknown",
            count: toSafeNumber(row.count),
          };
        })
        .filter((item): item is { time: string; count: number } => item !== null)
    : [];

  const dailyTrend = Array.isArray(source.dailyTrend)
    ? source.dailyTrend
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const row = item as Record<string, unknown>;
          return {
            date: typeof row.date === "string" ? row.date : "",
            count: toSafeNumber(row.count),
          };
        })
        .filter((item): item is { date: string; count: number } => item !== null)
    : [];

  const serviceBreakdown = Array.isArray(source.serviceBreakdown)
    ? source.serviceBreakdown
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const row = item as Record<string, unknown>;
          return {
            service: typeof row.service === "string" ? row.service : "Other",
            count: toSafeNumber(row.count),
          };
        })
        .filter((item): item is { service: string; count: number } => item !== null)
    : [];

  const statusBreakdown = Array.isArray(source.statusBreakdown)
    ? source.statusBreakdown
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const row = item as Record<string, unknown>;
          return {
            status: typeof row.status === "string" ? row.status : "unknown",
            count: toSafeNumber(row.count),
          };
        })
        .filter((item): item is { status: string; count: number } => item !== null)
    : [];

  return {
    peakHours,
    dailyTrend,
    serviceBreakdown,
    statusBreakdown: statusBreakdown.length > 0 ? statusBreakdown : emptyAnalytics().statusBreakdown,
  };
}

export default function Admin({ onLogout }: AdminProps) {
  const { lang } = useI18n();
  const isAr = lang === "ar";
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: stats } = useGetClinicStats();
  const { data: appointments, isLoading } = useListAppointments();
  const updateStatus = useUpdateAppointmentStatus();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [promotions, setPromotions] = useState<Promo[]>([]);
  const [promoForm, setPromoForm] = useState<Promo>({
    titleAr: "", titleEn: "", discount: "", descriptionAr: "", descriptionEn: "", isActive: true,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSavingPromo, setIsSavingPromo] = useState(false);
  const safeAppointments = Array.isArray(appointments) ? appointments : [];
  const safePromotions = Array.isArray(promotions) ? promotions : [];

  function notifyPromotionsUpdated() {
    window.dispatchEvent(new Event("promotions-updated"));
  }

  useEffect(() => {
    if (activeTab === "analytics") {
      void (async () => {
        try {
          const { data } = await requestApiJson<unknown>("/api/analytics/appointments");
          setAnalytics(normalizeAnalytics(data));
        } catch (error) {
          setAnalytics(emptyAnalytics());

          const reason =
            error instanceof ApiRequestError
              ? extractApiErrorMessage(error.data) ?? error.message
              : error instanceof Error
                ? error.message
                : undefined;

          toast({
            title: isAr ? "تعذر تحميل التحليلات" : "Failed to load analytics",
            description: reason,
            variant: "destructive",
          });
        }
      })();
    }
    if (activeTab === "promotions") {
      void loadPromotions();
    }
  }, [activeTab, isAr, toast]);

  async function loadPromotions() {
    try {
      const { data } = await requestApiJson<unknown>("/api/promotions");
      if (!Array.isArray(data)) {
        throw new Error(isAr ? "صيغة بيانات العروض غير متوقعة" : "Unexpected promotions response format");
      }

      setPromotions(data as Promo[]);
    } catch (error) {
      setPromotions([]);

      const reason =
        error instanceof ApiRequestError
          ? extractApiErrorMessage(error.data) ?? error.message
          : error instanceof Error
            ? error.message
            : undefined;

      toast({
        title: isAr ? "تعذر تحميل العروض" : "Failed to load promotions",
        description: reason,
        variant: "destructive",
      });
    }
  }

  async function savePromo() {
    setIsSavingPromo(true);
    try {
      const path = editingId ? `/api/promotions/${editingId}` : "/api/promotions";
      const method = editingId ? "PUT" : "POST";
      await requestApiJson(path, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promoForm),
      });

      toast({ title: isAr ? "تم الحفظ بنجاح" : "Saved successfully" });
      setPromoForm({ titleAr: "", titleEn: "", discount: "", descriptionAr: "", descriptionEn: "", isActive: true });
      setEditingId(null);
      await loadPromotions();
      notifyPromotionsUpdated();
    } catch (error) {
      const reason =
        error instanceof ApiRequestError
          ? extractApiErrorMessage(error.data) ?? error.message
          : error instanceof Error
            ? error.message
            : undefined;

      toast({
        title: isAr ? "تعذر حفظ العرض" : "Failed to save promotion",
        description: reason,
        variant: "destructive",
      });
    } finally {
      setIsSavingPromo(false);
    }
  }

  async function deletePromo(id: number) {
    try {
      await requestApiJson(`/api/promotions/${id}`, { method: "DELETE" });

      toast({ title: isAr ? "تم الحذف" : "Deleted" });
      await loadPromotions();
      notifyPromotionsUpdated();
    } catch (error) {
      const reason =
        error instanceof ApiRequestError
          ? extractApiErrorMessage(error.data) ?? error.message
          : error instanceof Error
            ? error.message
            : undefined;

      toast({
        title: isAr ? "تعذر حذف العرض" : "Failed to delete promotion",
        description: reason,
        variant: "destructive",
      });
    }
  }

  async function togglePromo(p: Promo) {
    if (!p.id) return;
    try {
      await requestApiJson(`/api/promotions/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...p, isActive: !p.isActive }),
      });

      await loadPromotions();
      notifyPromotionsUpdated();
    } catch (error) {
      const reason =
        error instanceof ApiRequestError
          ? extractApiErrorMessage(error.data) ?? error.message
          : error instanceof Error
            ? error.message
            : undefined;

      toast({
        title: isAr ? "تعذر تحديث الحالة" : "Failed to update status",
        description: reason,
        variant: "destructive",
      });
    }
  }

  const handleStatusChange = (id: number, status: UpdateAppointmentStatusBodyStatus) => {
    updateStatus.mutate(
      { id, data: { status } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListAppointmentsQueryKey() });
          toast({ title: isAr ? "تم تحديث الحالة بنجاح" : "Status updated successfully" });
        },
        onError: () => {
          toast({ title: isAr ? "فشل تحديث الحالة" : "Failed to update status", variant: "destructive" });
        }
      }
    );
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case "pending": return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">{isAr ? "قيد الانتظار" : "Pending"}</Badge>;
      case "confirmed": return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{isAr ? "مؤكد" : "Confirmed"}</Badge>;
      case "completed": return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{isAr ? "مكتمل" : "Completed"}</Badge>;
      case "cancelled": return <Badge variant="destructive">{isAr ? "ملغي" : "Cancelled"}</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const statCards = [
    { title: isAr ? "إجمالي المواعيد" : "Total Appointments", value: stats?.totalAppointments ?? 0, icon: CalendarDays, color: "text-primary" },
    { title: isAr ? "قيد الانتظار" : "Pending", value: stats?.pendingAppointments ?? 0, icon: Clock, color: "text-yellow-500" },
    { title: isAr ? "مؤكدة" : "Confirmed", value: stats?.confirmedAppointments ?? 0, icon: CalendarCheck, color: "text-blue-500" },
    { title: isAr ? "مكتملة" : "Completed", value: stats?.completedAppointments ?? 0, icon: CheckCircle2, color: "text-green-500" },
  ];

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "overview", label: isAr ? "نظرة عامة" : "Overview", icon: Users },
    { key: "appointments", label: isAr ? "المواعيد" : "Appointments", icon: CalendarDays },
    { key: "analytics", label: isAr ? "تحليل البيانات" : "Analytics", icon: BarChart3 },
    { key: "promotions", label: isAr ? "العروض" : "Promotions", icon: Tag },
  ];

  const analyticsPeakHours = analytics?.peakHours ?? [];
  const analyticsDailyTrend = analytics?.dailyTrend ?? [];
  const analyticsServiceBreakdown = analytics?.serviceBreakdown ?? [];
  const analyticsStatusBreakdown = analytics?.statusBreakdown ?? [];

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{isAr ? "لوحة تحكم الإدارة" : "Admin Dashboard"}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{isAr ? "عيادة سمايل برو — د. أحمد طارق" : "SmilePro Clinic — Dr. Ahmed Tarek"}</p>
        </div>
        <Button variant="outline" size="sm" onClick={onLogout} className="gap-2 rounded-full">
          <LogOut className="h-4 w-4" />
          {isAr ? "تسجيل الخروج" : "Logout"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap mb-8 border-b border-border pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((card, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                    <card.icon className={`h-4 w-4 ${card.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{card.value}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-center gap-3">
            <Users className="h-5 w-5 text-primary shrink-0" />
            <span className="text-sm font-medium">
              {isAr
                ? `مواعيد اليوم: ${stats?.todayAppointments ?? 0} | المرضى السعداء: ${stats?.happyPatients ?? 500}+`
                : `Today's appointments: ${stats?.todayAppointments ?? 0} | Happy patients: ${stats?.happyPatients ?? 500}+`}
            </span>
          </div>
        </div>
      )}

      {/* Appointments Tab */}
      {activeTab === "appointments" && (
        <Card>
          <CardHeader><CardTitle>{isAr ? "قائمة المواعيد" : "Appointments List"}</CardTitle></CardHeader>
          <CardContent>
            <div className="rounded-xl border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>{isAr ? "التاريخ والوقت" : "Date & Time"}</TableHead>
                    <TableHead>{isAr ? "المريض" : "Patient"}</TableHead>
                    <TableHead>{isAr ? "الخدمة" : "Service"}</TableHead>
                    <TableHead>{isAr ? "الملاحظات" : "Notes"}</TableHead>
                    <TableHead>{isAr ? "الحالة" : "Status"}</TableHead>
                    <TableHead className="text-end">{isAr ? "الإجراءات" : "Actions"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">{isAr ? "جاري التحميل..." : "Loading..."}</TableCell></TableRow>
                  ) : safeAppointments.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">{isAr ? "لا توجد مواعيد بعد." : "No appointments yet."}</TableCell></TableRow>
                  ) : (
                    safeAppointments.map((apt) => (
                      <TableRow key={apt.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium">
                          <div>{format(new Date(apt.preferredDate), "MMM d, yyyy")}</div>
                          <div className="text-xs text-muted-foreground mt-0.5" dir="ltr">{apt.preferredTime}</div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{apt.patientName}</div>
                          <div className="text-xs text-muted-foreground mt-0.5" dir="ltr">{apt.patientPhone}</div>
                        </TableCell>
                        <TableCell><span className="text-sm">{apt.service}</span></TableCell>
                        <TableCell><span className="text-xs text-muted-foreground">{apt.notes ?? "—"}</span></TableCell>
                        <TableCell>{getStatusBadge(apt.status as AppointmentStatus)}</TableCell>
                        <TableCell className="text-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleStatusChange(apt.id, "pending")}>{isAr ? "قيد الانتظار" : "Mark Pending"}</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(apt.id, "confirmed")}>{isAr ? "تأكيد الموعد" : "Mark Confirmed"}</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(apt.id, "completed")}>{isAr ? "تعيين كمكتمل" : "Mark Completed"}</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => handleStatusChange(apt.id, "cancelled")}>{isAr ? "إلغاء" : "Cancel"}</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-8">
          {!analytics ? (
            <div className="text-center py-20 text-muted-foreground">{isAr ? "جاري تحميل البيانات..." : "Loading analytics..."}</div>
          ) : (
            <>
              {/* Peak Hours */}
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" />{isAr ? "ساعات الذروة" : "Peak Hours"}</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={analyticsPeakHours.slice(0, 10)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} name={isAr ? "المواعيد" : "Appointments"} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Daily Trend */}
                <Card>
                  <CardHeader><CardTitle className="text-sm">{isAr ? "المواعيد اليومية (آخر 30 يوم)" : "Daily Appointments (Last 30 Days)"}</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={analyticsDailyTrend.slice(-14)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 9 }} tickFormatter={(v) => v.slice(5)} />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name={isAr ? "مواعيد" : "Appointments"} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Status Breakdown */}
                <Card>
                  <CardHeader><CardTitle className="text-sm">{isAr ? "توزيع حالات المواعيد" : "Appointment Status Breakdown"}</CardTitle></CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={analyticsStatusBreakdown} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80}>
                          {analyticsStatusBreakdown.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Service Breakdown */}
              <Card>
                <CardHeader><CardTitle className="text-sm">{isAr ? "توزيع الخدمات" : "Service Breakdown"}</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={analyticsServiceBreakdown.slice(0, 8)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" allowDecimals={false} />
                      <YAxis dataKey="service" type="category" tick={{ fontSize: 11 }} width={130} />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} name={isAr ? "مواعيد" : "Appointments"} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

      {/* Promotions Tab */}
      {activeTab === "promotions" && (
        <div className="space-y-8">
          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                {editingId ? (isAr ? "تعديل العرض" : "Edit Promotion") : (isAr ? "إضافة عرض جديد" : "Add New Promotion")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">{isAr ? "العنوان بالعربية" : "Title (Arabic)"}</Label>
                  <Input value={promoForm.titleAr} onChange={(e) => setPromoForm({ ...promoForm, titleAr: e.target.value })} placeholder="مثال: خصم 20% على تبييض الأسنان" />
                </div>
                <div>
                  <Label className="mb-2 block">{isAr ? "العنوان بالإنجليزية" : "Title (English)"}</Label>
                  <Input value={promoForm.titleEn} onChange={(e) => setPromoForm({ ...promoForm, titleEn: e.target.value })} placeholder="e.g. 20% off teeth whitening" />
                </div>
                <div>
                  <Label className="mb-2 block">{isAr ? "الخصم" : "Discount"}</Label>
                  <Input value={promoForm.discount} onChange={(e) => setPromoForm({ ...promoForm, discount: e.target.value })} placeholder="e.g. 20% OFF" />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <button onClick={() => setPromoForm({ ...promoForm, isActive: !promoForm.isActive })} className="flex items-center gap-2 text-sm font-medium">
                    {promoForm.isActive ? <ToggleRight className="h-6 w-6 text-green-500" /> : <ToggleLeft className="h-6 w-6 text-muted-foreground" />}
                    {isAr ? (promoForm.isActive ? "نشط" : "غير نشط") : (promoForm.isActive ? "Active" : "Inactive")}
                  </button>
                </div>
                <div>
                  <Label className="mb-2 block">{isAr ? "الوصف بالعربية" : "Description (Arabic)"}</Label>
                  <Textarea value={promoForm.descriptionAr} onChange={(e) => setPromoForm({ ...promoForm, descriptionAr: e.target.value })} placeholder="وصف العرض..." rows={2} />
                </div>
                <div>
                  <Label className="mb-2 block">{isAr ? "الوصف بالإنجليزية" : "Description (English)"}</Label>
                  <Textarea value={promoForm.descriptionEn} onChange={(e) => setPromoForm({ ...promoForm, descriptionEn: e.target.value })} placeholder="Offer description..." rows={2} />
                </div>
              </div>
              <div className="flex gap-3 mt-5">
                <Button onClick={savePromo} disabled={isSavingPromo || !promoForm.titleAr || !promoForm.titleEn}>
                  <Plus className="h-4 w-4 me-2" />
                  {isSavingPromo
                    ? (isAr ? "جاري الحفظ..." : "Saving...")
                    : editingId
                      ? (isAr ? "حفظ التعديلات" : "Save Changes")
                      : (isAr ? "إضافة العرض" : "Add Promotion")}
                </Button>
                {editingId && (
                  <Button variant="outline" onClick={() => { setEditingId(null); setPromoForm({ titleAr: "", titleEn: "", discount: "", descriptionAr: "", descriptionEn: "", isActive: true }); }}>
                    {isAr ? "إلغاء" : "Cancel"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">{isAr ? "العروض الحالية" : "Current Promotions"}</h3>
            {safePromotions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-2xl border border-dashed border-border">
                <Tag className="h-10 w-10 mx-auto mb-2 opacity-20" />
                <p>{isAr ? "لا توجد عروض بعد. أضف عرضاً جديداً!" : "No promotions yet. Add a new one!"}</p>
              </div>
            ) : (
              safePromotions.map((p) => (
                <div key={p.id} className="bg-card border border-border rounded-2xl p-5 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold">{isAr ? p.titleAr : p.titleEn}</span>
                      {p.discount && <Badge variant="secondary">{p.discount}</Badge>}
                      <Badge variant={p.isActive ? "default" : "outline"} className={p.isActive ? "bg-green-500" : ""}>
                        {p.isActive ? (isAr ? "نشط" : "Active") : (isAr ? "غير نشط" : "Inactive")}
                      </Badge>
                    </div>
                    {(isAr ? p.descriptionAr : p.descriptionEn) && (
                      <p className="text-sm text-muted-foreground">{isAr ? p.descriptionAr : p.descriptionEn}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => togglePromo(p)} title={isAr ? "تغيير الحالة" : "Toggle status"}>
                      {p.isActive ? <ToggleRight className="h-4 w-4 text-green-500" /> : <ToggleLeft className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => { setEditingId(p.id!); setPromoForm(p); setActiveTab("promotions"); }}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => deletePromo(p.id!)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
