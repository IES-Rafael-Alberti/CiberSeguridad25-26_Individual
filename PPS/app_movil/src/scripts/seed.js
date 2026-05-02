import { hasSupabase, getSupabase } from "../config/supabase.js";

async function seedSupabase() {
  const supabase = getSupabase();

  await supabase.from("products").upsert([
    { id: 1, name: "Collar reflectante", price: 14.5, is_active: true },
    { id: 2, name: "Alimento premium gato", price: 32.0, is_active: true }
  ]);

  await supabase.from("vet_services").upsert([
    { id: 1, name: "Vacunacion anual", price: 28.0, is_active: true },
    { id: 2, name: "Desparasitacion", price: 18.0, is_active: true }
  ]);

  console.log("Seed completado en Supabase");
}

if (!hasSupabase()) {
  console.log("SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY no definidos. Seed omitido.");
  process.exit(0);
}

seedSupabase().catch((err) => {
  console.error("Error en seed:", err.message);
  process.exit(1);
});
