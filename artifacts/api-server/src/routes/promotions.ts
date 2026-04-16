import { Router } from "express";
import { db } from "@workspace/db";
import { promotionsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

type PromotionResponse = {
  id: number;
  titleAr: string;
  titleEn: string;
  discount: string;
  descriptionAr: string;
  descriptionEn: string;
  isActive: boolean;
  createdAt: string;
};

let fallbackPromotions: PromotionResponse[] = [];
let fallbackPromotionId = 1;

function toTrimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizePromotionBody(input: unknown) {
  const payload = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const titleAr = toTrimmedString(payload.titleAr);
  const titleEn = toTrimmedString(payload.titleEn);

  return {
    titleAr,
    titleEn,
    discount: toTrimmedString(payload.discount),
    descriptionAr: toTrimmedString(payload.descriptionAr),
    descriptionEn: toTrimmedString(payload.descriptionEn),
    isActive: typeof payload.isActive === "boolean" ? payload.isActive : true,
  };
}

function toPromotionResponse(row: typeof promotionsTable.$inferSelect): PromotionResponse {
  return {
    id: row.id,
    titleAr: row.titleAr,
    titleEn: row.titleEn,
    discount: row.discount ?? "",
    descriptionAr: row.descriptionAr ?? "",
    descriptionEn: row.descriptionEn ?? "",
    isActive: row.isActive,
    createdAt: row.createdAt.toISOString(),
  };
}

function listFallbackPromotions() {
  return [...fallbackPromotions].sort((a, b) => b.id - a.id);
}

router.get("/", async (req, res) => {
  try {
    const promotions = await db
      .select()
      .from(promotionsTable)
      .orderBy(desc(promotionsTable.createdAt));
    res.json(promotions.map(toPromotionResponse));
  } catch (err) {
    req.log.warn({ err }, "Failed to list promotions from DB, using in-memory fallback");
    res.json(listFallbackPromotions());
  }
});

router.get("/active", async (req, res) => {
  try {
    const promotions = await db
      .select()
      .from(promotionsTable)
      .where(eq(promotionsTable.isActive, true))
      .orderBy(desc(promotionsTable.createdAt));
    res.json(promotions.map(toPromotionResponse));
  } catch (err) {
    req.log.warn({ err }, "Failed to get active promotions from DB, using in-memory fallback");
    res.json(listFallbackPromotions().filter((p) => p.isActive));
  }
});

router.post("/", async (req, res) => {
  const normalized = normalizePromotionBody(req.body);
  if (!normalized.titleAr || !normalized.titleEn) {
    return res.status(400).json({ error: "titleAr and titleEn are required" });
  }

  try {
    const [promo] = await db
      .insert(promotionsTable)
      .values({
        titleAr: normalized.titleAr,
        titleEn: normalized.titleEn,
        discount: normalized.discount || null,
        descriptionAr: normalized.descriptionAr || null,
        descriptionEn: normalized.descriptionEn || null,
        isActive: normalized.isActive,
      })
      .returning();
    res.status(201).json(toPromotionResponse(promo));
  } catch (err) {
    req.log.warn({ err }, "Failed to create promotion in DB, using in-memory fallback");
    const created: PromotionResponse = {
      id: fallbackPromotionId++,
      titleAr: normalized.titleAr,
      titleEn: normalized.titleEn,
      discount: normalized.discount,
      descriptionAr: normalized.descriptionAr,
      descriptionEn: normalized.descriptionEn,
      isActive: normalized.isActive,
      createdAt: new Date().toISOString(),
    };
    fallbackPromotions = [created, ...fallbackPromotions];
    res.status(201).json(created);
  }
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid promotion id" });
  }

  const normalized = normalizePromotionBody(req.body);
  if (!normalized.titleAr || !normalized.titleEn) {
    return res.status(400).json({ error: "titleAr and titleEn are required" });
  }

  try {
    const [updated] = await db
      .update(promotionsTable)
      .set({
        titleAr: normalized.titleAr,
        titleEn: normalized.titleEn,
        discount: normalized.discount || null,
        descriptionAr: normalized.descriptionAr || null,
        descriptionEn: normalized.descriptionEn || null,
        isActive: normalized.isActive,
      })
      .where(eq(promotionsTable.id, id))
      .returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(toPromotionResponse(updated));
  } catch (err) {
    req.log.warn({ err }, "Failed to update promotion in DB, using in-memory fallback");
    const index = fallbackPromotions.findIndex((promo) => promo.id === id);
    if (index === -1) return res.status(404).json({ error: "Not found" });

    const current = fallbackPromotions[index];
    const updated: PromotionResponse = {
      ...current,
      titleAr: normalized.titleAr,
      titleEn: normalized.titleEn,
      discount: normalized.discount,
      descriptionAr: normalized.descriptionAr,
      descriptionEn: normalized.descriptionEn,
      isActive: normalized.isActive,
    };
    fallbackPromotions[index] = updated;
    res.json(updated);
  }
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid promotion id" });
  }

  try {
    await db.delete(promotionsTable).where(eq(promotionsTable.id, id));
    res.json({ success: true });
  } catch (err) {
    req.log.warn({ err }, "Failed to delete promotion in DB, using in-memory fallback");
    const before = fallbackPromotions.length;
    fallbackPromotions = fallbackPromotions.filter((promo) => promo.id !== id);
    if (fallbackPromotions.length === before) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json({ success: true });
  }
});

export default router;
