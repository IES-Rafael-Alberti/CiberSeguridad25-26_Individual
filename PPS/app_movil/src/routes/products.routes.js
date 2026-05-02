import { Router } from "express";
import { getProducts } from "../data/repository.js";
import { allowRoles } from "../middleware/authorization.js";

const router = Router();

router.get("/", async (_req, res) => {
  const products = await getProducts();
  res.json({ products });
});

router.post("/", allowRoles(["admin", "sales"]), async (req, res) => {
  res.status(201).json({
    message: "Ejemplo de endpoint protegido por RBAC para crear producto",
    payload: req.body
  });
});

export default router;
