import { useI18n } from "@/lib/i18n";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateAppointment, useListServices } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Clock, User, Phone, Mail, FileText } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import bookingSmileImg from "@assets/image_1776299517022.png";

const formSchema = z.object({
  patientName: z.string().min(2, "Name must be at least 2 characters"),
  patientPhone: z.string().min(8, "Valid phone number required"),
  patientEmail: z.string().email("Invalid email").optional().or(z.literal('')),
  service: z.string().min(1, "Please select a service"),
  preferredDate: z.date({
    required_error: "A date of birth is required.",
  }),
  preferredTime: z.string().min(1, "Please select a time"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM"
];

export default function Book() {
  const { t, lang } = useI18n();
  const { toast } = useToast();
  const { data: services } = useListServices();
  const createAppointment = useCreateAppointment();
  const safeServices = Array.isArray(services) ? services : [];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: "",
      patientPhone: "",
      patientEmail: "",
      service: "",
      preferredTime: "",
      notes: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    createAppointment.mutate(
      {
        data: {
          ...data,
          patientEmail: data.patientEmail || null,
          preferredDate: format(data.preferredDate, "yyyy-MM-dd"),
          notes: data.notes || null,
        }
      },
      {
        onSuccess: () => {
          toast({
            title: t("book.success"),
            variant: "default",
          });
          form.reset();
        },
        onError: () => {
          toast({
            title: t("error"),
            variant: "destructive",
          });
        }
      }
    );
  };

  const isAr = lang === "ar";

  return (
    <div className="w-full">
      {/* Booking Form */}
      <div className="container mx-auto px-4 py-16 max-w-6xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl font-bold mb-3">{isAr ? "احجز موعدك الآن" : "Book Your Appointment"}</h2>
        <p className="text-muted-foreground">{isAr ? "أكمل البيانات التالية وسنتواصل معك في أقرب وقت" : "Fill in the details below and we'll contact you shortly"}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
      <motion.aside
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="lg:col-span-2"
      >
        <div className="rounded-2xl border border-border bg-card p-3 shadow-sm">
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={bookingSmileImg}
              alt={isAr ? "نتيجة ابتسامة قبل وبعد" : "Before and after smile result"}
              className="w-full h-[280px] sm:h-[360px] object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/55 to-transparent">
              <p className="text-white font-semibold text-sm">
                {isAr ? "نتائج ملموسة بابتسامة أجمل" : "Visible Results, Brighter Smile"}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
            <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-center font-medium">
              {isAr ? "حجز سريع" : "Quick Booking"}
            </div>
            <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-center font-medium">
              {isAr ? "تأكيد فوري" : "Fast Confirmation"}
            </div>
          </div>
        </div>
      </motion.aside>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="lg:col-span-3 bg-card border border-border rounded-2xl shadow-sm p-6 md:p-10"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("book.name")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:right-3 rtl:left-auto" />
                        <Input placeholder="John Doe" className="pl-10 rtl:pr-10 rtl:pl-3" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="patientPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("book.phone")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:right-3 rtl:left-auto" />
                        <Input placeholder="+20 100 000 0000" className="pl-10 rtl:pr-10 rtl:pl-3 text-left rtl:text-right" dir="ltr" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="patientEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("book.email")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground rtl:right-3 rtl:left-auto" />
                      <Input placeholder="john@example.com" className="pl-10 rtl:pr-10 rtl:pl-3 text-left rtl:text-right" dir="ltr" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="service"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("book.service")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("book.service")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {safeServices.map((service) => (
                        <SelectItem key={service.id} value={service.nameEn}>
                          {lang === "ar" ? service.nameAr : service.nameEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="preferredDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("book.date")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal rtl:pr-3 rtl:text-right",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50 rtl:mr-auto rtl:ml-0" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("book.time")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <Clock className="h-4 w-4 mr-2 opacity-50 rtl:ml-2 rtl:mr-0" />
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TIME_SLOTS.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("book.notes")}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground rtl:right-3 rtl:left-auto" />
                      <Textarea 
                        placeholder="Any special requests or concerns..." 
                        className="min-h-[120px] pl-10 pt-3 rtl:pr-10 rtl:pl-3" 
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              size="lg" 
              className="w-full text-lg h-14 rounded-xl"
              disabled={createAppointment.isPending}
            >
              {createAppointment.isPending ? t("book.submitting") : t("book.submit")}
            </Button>
          </form>
        </Form>
      </motion.div>
      </div>
      </div>
    </div>
  );
}
