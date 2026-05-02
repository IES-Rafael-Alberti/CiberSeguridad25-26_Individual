const outputPanel = document.getElementById("outputPanel");
const tokenPreview = document.getElementById("tokenPreview");
const sessionState = document.getElementById("sessionState");
const sessionMeta = document.getElementById("sessionMeta");
const rolePills = document.getElementById("rolePills");
const sessionSource = document.getElementById("sessionSource");
const permissionBadges = document.getElementById("permissionBadges");
const capabilitiesList = document.getElementById("capabilitiesList");
const productsList = document.getElementById("productsList");
const servicesList = document.getElementById("servicesList");
const offersList = document.getElementById("offersList");
const adminPanel = document.getElementById("adminPanel");
const adminUsersList = document.getElementById("adminUsersList");
const refreshUsersBtn = document.getElementById("refreshUsersBtn");
const adminRoleChecks = document.getElementById("adminRoleChecks");
const adminSaveRolesBtn = document.getElementById("adminSaveRolesBtn");
const adminSelectedUserLabel = document.getElementById("adminSelectedUserLabel");
const localLoginForm = document.getElementById("localLoginForm");
const localEmail = document.getElementById("localEmail");
const localPassword = document.getElementById("localPassword");
const copyTokenBtn = document.getElementById("copyTokenBtn");
const loadTokenBtn = document.getElementById("loadTokenBtn");
const loadCatalogBtn = document.getElementById("loadCatalogBtn");
const logoutBtn = document.getElementById("logoutBtn");

const tokenKey = "vet_access_token";
const tokenSourceKey = "vet_access_token_source";
const VALID_ROLES = ["admin", "client", "vet", "sales"];
const catalogEmptyState = {
  products: "Inicia sesión para ver el catálogo de productos.",
  services: "Inicia sesión para ver los servicios.",
  offers: "Si adoptas una mascota, aquí verás promociones especiales."
};

let adminUsersCache = [];
let selectedAdminUserId = null;

function getCapabilities(user = {}) {
  const roles = Array.isArray(user.roles) ? user.roles : [];
  const capabilities = [];

  if (roles.includes("admin")) {
    capabilities.push("Gestionar catálogo completo", "Aprobar adopciones", "Ver ofertas exclusivas");
  }

  if (roles.includes("sales")) {
    capabilities.push("Administrar productos", "Ver catálogo de tienda", "Consultar promociones");
  }

  if (roles.includes("vet")) {
    capabilities.push("Gestionar servicios", "Aprobar adopciones", "Actualizar estado clínico");
  }

  if (roles.includes("client")) {
    capabilities.push("Comprar artículos", "Reservar servicios", "Solicitar adopción");
    capabilities.push(Number(user.adoptedPetCount || 0) > 0 ? "Ver ofertas exclusivas" : "Adoptar para desbloquear ofertas");
  }

  return [...new Set(capabilities)];
}

function getTokenFromUrl() {
  const url = new URL(window.location.href);
  return url.searchParams.get("token") || "";
}

function clearTokenFromUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete("token");
  window.history.replaceState({}, document.title, `${url.pathname}${url.search}${url.hash}`);
}

function setOutput(value) {
  outputPanel.textContent = typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

function readToken() {
  return localStorage.getItem(tokenKey) || "";
}

function readTokenSource() {
  return localStorage.getItem(tokenSourceKey) || "ninguna";
}

function storeToken(token, source = "manual") {
  localStorage.setItem(tokenKey, token);
  localStorage.setItem(tokenSourceKey, source);
  renderToken();
}

function clearToken() {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(tokenSourceKey);
  renderToken();
  setOutput("Sesión local cerrada.");
}

function renderToken() {
  const token = readToken();
  const shortToken = token ? `${token.slice(0, 28)}...${token.slice(-18)}` : "Aún no hay token";
  tokenPreview.textContent = shortToken;
  sessionState.textContent = token ? "Sesión activa" : "Sin iniciar sesión";
  sessionMeta.textContent = token ? "El token está guardado en localStorage y listo para probar endpoints." : "Inicia con OAuth 2 o con login de prueba.";
  sessionSource.textContent = `Fuente: ${readTokenSource()}`;
}

function adoptTokenFromUrl() {
  const token = getTokenFromUrl();
  if (!token) return false;
  storeToken(token, "google");
  clearTokenFromUrl();
  setOutput("Token OAuth 2 recibido desde Google y guardado correctamente.");
  return true;
}

function renderRoles(roles = []) {
  rolePills.innerHTML = roles.length
    ? roles.map((role) => `<span class="role-pill">${role}</span>`).join("")
    : `<span class="role-pill">Sin roles</span>`;
  permissionBadges.innerHTML = roles.length
    ? roles.map((role) => `<span class="role-pill">${role}</span>`).join("")
    : `<span class="role-pill">Sin roles</span>`;
}

function renderCapabilities(user = {}) {
  if (!capabilitiesList) return;
  const capabilities = getCapabilities(user);
  capabilitiesList.innerHTML = capabilities.length
    ? capabilities.map((capability) => `<li>${capability}</li>`).join("")
    : `<li>Inicia sesión para ver las acciones disponibles.</li>`;
}

function setAdminPanelVisible(visible) {
  if (!adminPanel) return;
  adminPanel.classList.toggle("hidden", !visible);
}

function renderAdminUsers(users = []) {
  if (!adminUsersList) return;
  adminUsersCache = users;

  if (!users.length) {
    adminUsersList.innerHTML = '<div class="empty-state">No hay usuarios cargados.</div>';
    adminSelectedUserLabel.textContent = "Selecciona un usuario para editar sus roles.";
    adminRoleChecks.innerHTML = "";
    adminSaveRolesBtn.disabled = true;
    return;
  }

  adminUsersList.innerHTML = users
    .map((user) => {
      const selectedClass = user.id === selectedAdminUserId ? "selected" : "";

      return `
        <article class="admin-user-card ${selectedClass}" data-user-id="${user.id}">
          <div>
            <h4>${user.fullName || "Usuario"}</h4>
            <p class="admin-user-email">ID: ${user.id}</p>
          </div>
          <div class="mini-tag-row">${(user.roles || []).map((role) => `<span class="role-pill">${role}</span>`).join("")}</div>
          <button class="secondary-button" data-select-user="${user.id}">Seleccionar</button>
        </article>
      `;
    })
    .join("");

  if (!selectedAdminUserId && users.length) {
    selectedAdminUserId = users[0].id;
  }

  const selectedUser = users.find((user) => user.id === selectedAdminUserId);
  renderAdminRoleEditor(selectedUser || null);
}

function renderAdminRoleEditor(user) {
  if (!adminRoleChecks || !adminSelectedUserLabel || !adminSaveRolesBtn) return;

  if (!user) {
    adminSelectedUserLabel.textContent = "Selecciona un usuario para editar sus roles.";
    adminRoleChecks.innerHTML = "";
    adminSaveRolesBtn.disabled = true;
    return;
  }

  adminSelectedUserLabel.textContent = `Usuario seleccionado: ${user.fullName || user.id}`;
  adminRoleChecks.innerHTML = VALID_ROLES.map((role) => {
    const checked = (user.roles || []).includes(role) ? "checked" : "";
    return `<label><input type="checkbox" data-role="${role}" ${checked} /> ${role}</label>`;
  }).join("");
  adminSaveRolesBtn.disabled = false;
}

async function loadAdminUsers() {
  const token = readToken();
  if (!token) return;
  const response = await fetch("/admin/users", {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    setOutput("No tienes permisos de admin para gestionar usuarios.");
    renderAdminUsers([]);
    return;
  }

  const payload = await response.json();
  renderAdminUsers(payload.users || []);
}

async function saveUserRoles(userId) {
  const token = readToken();
  const roles = [...adminRoleChecks.querySelectorAll("input[data-role]:checked")]
    .map((input) => input.getAttribute("data-role"));

  const response = await fetch(`/admin/users/${userId}/roles`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ roles })
  });

  const payload = await response.json();
  setOutput({ action: "admin-update-roles", status: response.status, payload });
  await loadAdminUsers();
  await refreshSession();
}

async function loginWithLocalCredentials(event) {
  event.preventDefault();
  const email = String(localEmail?.value || "").trim();
  const password = String(localPassword?.value || "").trim();

  if (!email || !password) {
    setOutput("Completa email y contraseña.");
    return;
  }

  const response = await fetch("/auth/local-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const payload = await response.json();
  if (!response.ok) {
    setOutput(payload.error || "No se pudo iniciar sesión local.");
    return;
  }

  storeToken(payload.accessToken, "local");
  renderRoles(payload.user.roles || []);
  renderCapabilities(payload.user);
  sessionState.textContent = `${payload.user.email}`;
  sessionMeta.textContent = `Roles: ${(payload.user.roles || []).join(", ")}`;
  sessionSource.textContent = "Fuente: local-login";
  setOutput({ action: "local-login", payload });
  await refreshSession();
}

async function fetchMe() {
  const token = readToken();
  if (!token) return null;
  const response = await fetch("/auth/me", {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) return null;
  return response.json();
}

async function refreshSession() {
  const data = await fetchMe();
  if (!data?.user) {
    renderRoles([]);
    renderCapabilities({});
    renderToken();
    setAdminPanelVisible(false);
    return;
  }
  renderRoles(data.user.roles || []);
  renderCapabilities(data.user);
  renderToken();
  sessionState.textContent = `${data.user.email}`;
  sessionMeta.textContent = `Roles: ${(data.user.roles || []).join(", ") || "sin roles"}`;
  sessionSource.textContent = `Fuente: ${readTokenSource()}`;
  const isAdmin = (data.user.roles || []).includes("admin");
  setAdminPanelVisible(isAdmin);
  if (isAdmin) await loadAdminUsers();
  await loadCatalog();
}

async function loginWithRole(role) {
  const response = await fetch("/auth/dev-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role })
  });
  const data = await response.json();
  storeToken(data.accessToken, "demo");
  renderRoles(data.user.roles || []);
  renderCapabilities(data.user);
  sessionState.textContent = `${data.user.email}`;
  sessionMeta.textContent = `Roles: ${(data.user.roles || []).join(", ")}`;
  sessionSource.textContent = `Fuente: demo (${role})`;
  setOutput({ action: "dev-login", role, response: data });
  await loadCatalog();
}

function renderCatalogCards(container, items, emptyMessage, kind) {
  if (!container) return;
  if (!items.length) {
    container.innerHTML = `<div class="empty-state">${emptyMessage}</div>`;
    return;
  }

  container.innerHTML = items
    .map((item) => {
      const meta = kind === "product"
        ? `€${Number(item.price).toFixed(2)}`
        : `€${Number(item.price).toFixed(2)}`;
      const state = item.isActive === false ? "Inactivo" : "Activo";
      return `
        <article class="catalog-card">
          <div class="catalog-card-top">
            <h4>${item.name}</h4>
            <span class="mini-tag">${state}</span>
          </div>
          <p>${kind === "product" ? "Artículo listo para tienda" : "Servicio veterinario disponible"}</p>
          <div class="catalog-meta">
            <strong>${meta}</strong>
          </div>
        </article>
      `;
    })
    .join("");
}

async function loadCatalog() {
  const token = readToken();
  if (!token) {
    renderCatalogCards(productsList, [], catalogEmptyState.products, "product");
    renderCatalogCards(servicesList, [], catalogEmptyState.services, "service");
    renderCatalogCards(offersList, [], catalogEmptyState.offers, "offer");
    return;
  }

  const [productsResponse, servicesResponse, offersResponse] = await Promise.all([
    fetch("/products", { headers: { Authorization: `Bearer ${token}` } }),
    fetch("/services", { headers: { Authorization: `Bearer ${token}` } }),
    fetch("/offers/exclusive", { headers: { Authorization: `Bearer ${token}` } })
  ]);

  const productsPayload = productsResponse.ok ? await productsResponse.json() : { products: [] };
  const servicesPayload = servicesResponse.ok ? await servicesResponse.json() : { services: [] };
  const offersPayload = offersResponse.ok ? await offersResponse.json() : { offers: [] };

  renderCatalogCards(productsList, productsPayload.products || [], "No hay productos disponibles.", "product");
  renderCatalogCards(servicesList, servicesPayload.services || [], "No hay servicios disponibles.", "service");
  renderCatalogCards(offersList, offersPayload.offers || [], "Todavía no tienes ofertas exclusivas.", "offer");
}

async function runAction(action) {
  const token = readToken();
  if (!token) {
    setOutput("Primero inicia sesión con Google o usa el modo demo.");
    return;
  }

  if (action === "/adoptions-demo") {
    const create = await fetch("/adoptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ petName: "Luna" })
    });
    const created = await create.json();
    setOutput({ action: "adoption-create", response: created });
    await refreshSession();
    return;
  }

  const response = await fetch(action, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : await response.text();
  setOutput({ status: response.status, payload });
}

copyTokenBtn.addEventListener("click", async () => {
  const token = readToken();
  if (!token) {
    setOutput("No hay token para copiar.");
    return;
  }
  await navigator.clipboard.writeText(token);
  setOutput("Token copiado al portapapeles.");
});

loadTokenBtn.addEventListener("click", refreshSession);
loadCatalogBtn.addEventListener("click", async () => {
  await refreshSession();
  setOutput("Catálogo actualizado.");
});
refreshUsersBtn?.addEventListener("click", async () => {
  await loadAdminUsers();
  setOutput("Listado de usuarios actualizado.");
});

adminUsersList?.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const userId = target.getAttribute("data-select-user");
  if (!userId) return;
  selectedAdminUserId = userId;
  renderAdminUsers(adminUsersCache);
});

adminSaveRolesBtn?.addEventListener("click", async () => {
  if (!selectedAdminUserId) {
    setOutput("Selecciona un usuario antes de guardar.");
    return;
  }
  await saveUserRoles(selectedAdminUserId);
});

localLoginForm?.addEventListener("submit", loginWithLocalCredentials);
logoutBtn.addEventListener("click", async () => {
  await fetch("/auth/logout", { method: "POST" });
  clearToken();
  await refreshSession();
});

document.querySelectorAll("[data-login-role]").forEach((button) => {
  button.addEventListener("click", () => loginWithRole(button.dataset.loginRole));
});

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => runAction(button.dataset.action));
});

renderToken();
adoptTokenFromUrl();
refreshSession()
  .then(() => loadCatalog())
  .catch(() => {});
