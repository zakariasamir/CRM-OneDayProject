import { Router } from "express";
const router = Router();
import { getManagers, createManager, updateManager, deleteManager, getLeads, createLead, updateLead, deleteLead } from "../controllers/employer.controller.js";
import authenticate from "../middlewares/auth.js";
import authorize from "../middlewares/role.js";

// Middleware
const authEmployer = [authenticate, authorize("employer")];

// Managers
router.get("/managers", authEmployer, getManagers);
router.post("/managers", authEmployer, createManager);
router.put("/managers/:managerId", authEmployer, updateManager);
router.delete("/managers/:managerId", authEmployer, deleteManager);

// Leads
router.get("/leads", authEmployer, getLeads);
router.post("/leads", authEmployer, createLead);
router.put("/leads/:leadId", authEmployer, updateLead);
router.delete("/leads/:leadId", authEmployer, deleteLead);

export default router;
