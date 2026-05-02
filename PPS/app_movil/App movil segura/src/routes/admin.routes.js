import { Router } from "express";
import { allowRoles } from "../middleware/authorization.js";
import { getUsersWithRoles, updateUserRoles } from "../data/repository.js";

const router = Router();
const VALID_ROLES = ["admin", "client", "vet", "sales"];

router.use(allowRoles(["admin"]));

router.get("/users", async (_req, res) => {
  const users = await getUsersWithRoles();
  res.json({ users });
});

router.patch("/users/:id/roles", async (req, res) => {
  const requestedRoles = Array.isArray(req.body?.roles)
    ? req.body.roles
    : typeof req.body?.roles === "string"
      ? req.body.roles.split(",").map((role) => role.trim())
      : [];

  const roles = requestedRoles.filter((role) => VALID_ROLES.includes(role));

  if (!roles.length) {
    return res.status(400).json({ error: "Debes enviar al menos un rol valido" });
  }

  const user = await updateUserRoles({ userId: req.params.id, roles });
  return res.json({ message: "Roles actualizados", user });
});

export default router;
