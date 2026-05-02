import { Router } from "express";
import { getVetServices } from "../data/repository.js";
import { allowRoles } from "../middleware/authorization.js";

const router = Router();

router.get("/", async (_req, res) => {
  const services = await getVetServices();
  res.json({ services });
});

router.post("/book", allowRoles(["client"]), async (req, res) => {
  res.status(201).json({
    message: "Reserva veterinaria creada",
    reservation: {
      ...req.body,
      clientId: req.user.id,
      status: "pending"
    }
  });
});

router.patch("/:id/status", allowRoles(["admin", "vet"]), async (req, res) => {
  res.json({
    message: "Estado del servicio actualizado",
    serviceId: Number(req.params.id),
    status: req.body.status
  });
});

export default router;
