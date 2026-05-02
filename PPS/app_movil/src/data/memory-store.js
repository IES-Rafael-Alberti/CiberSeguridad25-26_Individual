const db = {
  products: [
    { id: 1, name: "Collar reflectante", price: 14.5, isActive: true },
    { id: 2, name: "Alimento premium gato", price: 32.0, isActive: true }
  ],
  vetServices: [
    { id: 1, name: "Vacunacion anual", price: 28.0, isActive: true },
    { id: 2, name: "Desparasitacion", price: 18.0, isActive: true }
  ],
  adoptions: [],
  users: [
    {
      id: "local-admin",
      email: "admin@vetapp.local",
      fullName: "Administrador Local",
      avatarUrl: "",
      authProvider: "local",
      roles: ["admin"],
      adoptedPetCount: 0,
      city: "Madrid"
    }
  ]
};

export function getMemoryDb() {
  return db;
}
