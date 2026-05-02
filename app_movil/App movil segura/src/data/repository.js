import { getSupabase, hasSupabase } from "../config/supabase.js";
import { getMemoryDb } from "./memory-store.js";

const ALLOWED_ROLES = ["admin", "client", "vet", "sales"];

function mapProfileToUser(profile) {
  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.full_name ?? "",
    avatarUrl: profile.avatar_url ?? "",
    authProvider: profile.auth_provider ?? "google",
    roles: Array.isArray(profile.roles) ? profile.roles : [],
    adoptedPetCount: profile.adopted_pet_count ?? 0,
    city: profile.city ?? ""
  };
}

async function getUserRolesFromSupabase(supabase, userId) {
  const { data, error } = await supabase
    .from("user_roles")
    .select("roles(name)")
    .eq("user_id", userId);

  if (error) throw error;

  return data
    .map((entry) => entry.roles?.name)
    .filter(Boolean);
}

async function ensureUserRoleLinks(supabase, userId, roles) {
  const uniqueRoles = [...new Set(roles)];

  for (const roleName of uniqueRoles) {
    const { data: roleData, error: roleError } = await supabase
      .from("roles")
      .select("id,name")
      .eq("name", roleName)
      .single();

    if (roleError) throw roleError;

    const { error: linkError } = await supabase.from("user_roles").upsert({
      user_id: userId,
      role_id: roleData.id
    });

    if (linkError) throw linkError;
  }
}

export async function upsertUserFromOAuth(profile) {
  const roles = Array.isArray(profile.roles)
    ? profile.roles
    : profile.role
      ? [profile.role]
      : ["client"];

  if (hasSupabase()) {
    const supabase = getSupabase();
    const payload = {
      id: profile.id,
      email: profile.email,
      full_name: profile.fullName || "",
      avatar_url: profile.avatarUrl || "",
      auth_provider: profile.authProvider || "google",
      adopted_pet_count: profile.adoptedPetCount || 0,
      city: profile.city || ""
    };

    const { data, error } = await supabase
      .from("profiles")
      .upsert(payload)
      .select("id,email,full_name,avatar_url,auth_provider,adopted_pet_count,city")
      .single();

    if (error) throw error;

    await ensureUserRoleLinks(supabase, profile.id, roles);
    const userRoles = await getUserRolesFromSupabase(supabase, profile.id);
    return mapProfileToUser({ ...data, roles: userRoles });
  }

  const db = getMemoryDb();
  const existingIndex = db.users.findIndex((u) => u.id === profile.id);

  if (existingIndex >= 0) {
    db.users[existingIndex] = {
      ...db.users[existingIndex],
      email: profile.email,
      fullName: profile.fullName || db.users[existingIndex].fullName,
      avatarUrl: profile.avatarUrl || db.users[existingIndex].avatarUrl,
      authProvider: profile.authProvider || db.users[existingIndex].authProvider || "google",
      roles,
      city: profile.city || db.users[existingIndex].city
    };
    return db.users[existingIndex];
  }

  const user = {
    id: profile.id,
    email: profile.email,
    fullName: profile.fullName || "",
    avatarUrl: profile.avatarUrl || "",
    authProvider: profile.authProvider || "google",
    roles,
    adoptedPetCount: profile.adoptedPetCount || 0,
    city: profile.city || ""
  };
  db.users.push(user);
  return user;
}

export async function getProducts() {
  if (hasSupabase()) {
    const supabase = getSupabase();
    const { data, error } = await supabase.from("products").select("id,name,price,is_active");
    if (error) throw error;
    return data.map((p) => ({ id: p.id, name: p.name, price: p.price, isActive: p.is_active }));
  }
  return getMemoryDb().products;
}

export async function getVetServices() {
  if (hasSupabase()) {
    const supabase = getSupabase();
    const { data, error } = await supabase.from("vet_services").select("id,name,price,is_active");
    if (error) throw error;
    return data.map((s) => ({ id: s.id, name: s.name, price: s.price, isActive: s.is_active }));
  }
  return getMemoryDb().vetServices;
}

export async function createAdoptionRequest({ petName, userId }) {
  if (hasSupabase()) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("adoptions")
      .insert({ pet_name: petName, user_id: userId, status: "pending" })
      .select("id,pet_name,user_id,status")
      .single();

    if (error) throw error;

    return {
      id: data.id,
      petName: data.pet_name,
      userId: data.user_id,
      status: data.status
    };
  }

  const db = getMemoryDb();
  const adoption = {
    id: db.adoptions.length + 1,
    petName,
    userId,
    status: "pending"
  };
  db.adoptions.push(adoption);
  return adoption;
}

export async function approveAdoption({ adoptionId, approverRoles }) {
  const roles = Array.isArray(approverRoles) ? approverRoles : [];
  if (!["admin", "vet"].some((role) => roles.includes(role))) {
    throw new Error("Solo admin o vet pueden aprobar adopciones");
  }

  if (hasSupabase()) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("adoptions")
      .update({ status: "approved" })
      .eq("id", adoptionId)
      .select("id,user_id,status")
      .single();

    if (error) throw error;

    const { error: profileErr } = await supabase.rpc("increment_adopted_pet_count", {
      profile_id: data.user_id
    });

    if (profileErr) throw profileErr;

    return data;
  }

  const db = getMemoryDb();
  const adoption = db.adoptions.find((a) => a.id === adoptionId);
  if (!adoption) throw new Error("Adopcion no encontrada");

  adoption.status = "approved";
  const user = db.users.find((u) => u.id === adoption.userId);
  if (user) user.adoptedPetCount += 1;

  return adoption;
}

export async function getUsersWithRoles() {
  if (hasSupabase()) {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("profiles")
      .select("id,email,full_name,avatar_url,auth_provider,adopted_pet_count,city")
      .order("email", { ascending: true });

    if (error) throw error;

    const users = await Promise.all(
      (data || []).map(async (profile) => {
        const roles = await getUserRolesFromSupabase(supabase, profile.id);
        return mapProfileToUser({ ...profile, roles });
      })
    );

    return users;
  }

  return [...getMemoryDb().users].sort((a, b) => a.email.localeCompare(b.email));
}

export async function updateUserRoles({ userId, roles }) {
  const normalizedRoles = [...new Set((roles || []).filter((role) => ALLOWED_ROLES.includes(role)))];
  if (!normalizedRoles.length) {
    throw new Error("Debes asignar al menos un rol valido");
  }

  if (hasSupabase()) {
    const supabase = getSupabase();

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id,email,full_name,avatar_url,auth_provider,adopted_pet_count,city")
      .eq("id", userId)
      .single();

    if (profileError) throw profileError;

    const { error: deleteError } = await supabase.from("user_roles").delete().eq("user_id", userId);
    if (deleteError) throw deleteError;

    await ensureUserRoleLinks(supabase, userId, normalizedRoles);
    const updatedRoles = await getUserRolesFromSupabase(supabase, userId);

    return mapProfileToUser({ ...profileData, roles: updatedRoles });
  }

  const db = getMemoryDb();
  const user = db.users.find((entry) => entry.id === userId);
  if (!user) throw new Error("Usuario no encontrado");

  user.roles = normalizedRoles;
  return user;
}
