import { Router } from "express";
import { hasSupabase } from "../config/supabase.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json({
    status: "ok",
    database: hasSupabase() ? "supabase" : "memory",
    timestamp: new Date().toISOString()
  });
});

export default router;
