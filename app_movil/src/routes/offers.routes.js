import { Router } from "express";
import { allowByAttribute } from "../middleware/authorization.js";
import { canAccessExclusiveOffers } from "../policies/offer.policy.js";

const router = Router();

router.get("/exclusive", allowByAttribute(canAccessExclusiveOffers), (_req, res) => {
  res.json({
    offers: [
      {
        code: "ADOPTA10",
        type: "product",
        description: "10% en accesorios para mascotas adoptadas",
        discount: 10
      },
      {
        code: "SALUD15",
        type: "vet_service",
        description: "15% en consulta veterinaria post-adopcion",
        discount: 15
      }
    ]
  });
});

export default router;
