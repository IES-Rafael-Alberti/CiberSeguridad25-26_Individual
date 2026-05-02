export function allowRoles(roles) {
  return (req, res, next) => {
    const userRoles = Array.isArray(req.user?.roles) ? req.user.roles : [];
    const hasAllowedRole = roles.some((role) => userRoles.includes(role));
    if (!hasAllowedRole) {
      return res.status(403).json({ error: "No autorizado por RBAC" });
    }
    return next();
  };
}

export function allowByAttribute(policyFn) {
  return async (req, res, next) => {
    try {
      const allowed = await policyFn(req.user, req);
      if (!allowed) {
        return res.status(403).json({ error: "No autorizado por ABAC" });
      }
      return next();
    } catch (_err) {
      return res.status(500).json({ error: "Fallo evaluando politica ABAC" });
    }
  };
}
