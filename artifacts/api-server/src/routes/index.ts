import { Router, type IRouter } from "express";
import healthRouter from "./health";
import appointmentsRouter from "./appointments";
import servicesRouter from "./services";
import statsRouter from "./stats";
import promotionsRouter from "./promotions";
import analyticsRouter from "./analytics";
import aiChatRouter from "./ai-chat";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/appointments", appointmentsRouter);
router.use("/services", servicesRouter);
router.use("/stats", statsRouter);
router.use("/promotions", promotionsRouter);
router.use("/analytics", analyticsRouter);
router.use("/ai-chat", aiChatRouter);

export default router;
