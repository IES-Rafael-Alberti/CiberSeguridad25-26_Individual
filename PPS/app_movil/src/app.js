import express from "express";
import cors from "cors";
import session from "express-session";
import SQLiteStoreFactory from "connect-sqlite3";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { injectUser, requireAuth } from "./middleware/auth.js";
import { passport } from "./config/passport.js";
import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import productsRoutes from "./routes/products.routes.js";
import servicesRoutes from "./routes/services.routes.js";
import adoptionsRoutes from "./routes/adoptions.routes.js";
import offersRoutes from "./routes/offers.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const SQLiteStore = SQLiteStoreFactory(session);
const app = express();

app.use(cors());
app.use(express.static("public"));

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    store: new SQLiteStore({ db: "sessions.sqlite", dir: "." }),
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 8
    }
  })
);

app.use(passport.initialize());
app.use(injectUser);

app.get("/", (_req, res) => {
  res.sendFile("index.html", { root: "public" });
});

app.use("/health", healthRoutes);
app.use("/auth", authRoutes);
app.use("/products", requireAuth, productsRoutes);
app.use("/services", requireAuth, servicesRoutes);
app.use("/adoptions", requireAuth, adoptionsRoutes);
app.use("/offers", requireAuth, offersRoutes);
app.use("/admin", requireAuth, adminRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno" });
});

export default app;
