import { Router } from "express";
const router = Router();
import { getMyLeads, updateMyLead } from "../controllers/manager.controller.js";
import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/role.js";

const authManager = [authenticate, authorize("manager")];

router.get("/leads", authManager, getMyLeads);
router.patch("/leads/:id", authManager, updateMyLead);

export default router;
