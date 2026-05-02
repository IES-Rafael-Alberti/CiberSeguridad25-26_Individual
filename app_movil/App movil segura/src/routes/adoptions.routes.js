import { Router } from "express";
import { createAdoptionRequest, approveAdoption } from "../data/repository.js";
import { allowRoles } from "../middleware/authorization.js";

const router = Router();

router.post("/", allowRoles(["client"]), async (req, res) => {
  const adoption = await createAdoptionRequest({
    petName: req.body.petName,
    userId: req.user.id
  });

  res.status(201).json({ adoption });
});

router.patch("/:id/approve", allowRoles(["admin", "vet"]), async (req, res) => {
  const result = await approveAdoption({
    adoptionId: Number(req.params.id),
    approverRoles: req.user.roles
  });

  res.json({
    message: "Adopcion aprobada. Se habilitan ofertas exclusivas para el cliente.",
    result
  });
});

export default router;
