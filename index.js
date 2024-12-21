import "dotenv/config";
import express, { raw, static as serveStatic, json } from "express";
import { connect } from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { pbkdf2, timingSafeEqual } from "crypto";
import jwt from "jsonwebtoken";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import cookieParser from "cookie-parser";

import { productRouter } from "./routes/Products.js";
import { authRouter } from "./routes/Auth.js";
import { User } from "./model/User.js";
import { isAuth, sanitizeUser, cookieExtractor } from "./services/common.js";
import { categoriesRouter } from "./routes/Categories.js";
import { brandsRouter } from "./routes/Brands.js";
import { userRouter } from "./routes/Users.js";
import { cartRouter } from "./routes/Cart.js";
import { orderRouter } from "./routes/Order.js";
import { favouriteRouter } from "./routes/Favourite.js";
import { settingsRouter } from "./routes/Settings.js";
import { bannerRouter } from "./routes/Banner.js";
import { topBannerRouter } from "./routes/TopBanner.js";
// import { sunglassBannerRouter } from "./routes/SunglassBanner.js";
// import { sunglassProductRouter } from "./routes/SunglassProduct.js";
import { ratingsRouter } from "./routes/Ratings.js";
import { bkashRouter } from "./routes/bkash.js";
import { landingPageOrderRouter } from "./routes/LandingPageOrder.js";

// Webhook

const endpointSecret = process.env.ENDPOINT_SECRET;
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY;

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://xartso-admin.vercel.app",
  "https://xartso-client.vercel.app",
  "https://www.sevensbd.online",
  "https://sevensbd.online",
  "https://www.admin.sevensbd.online",
  "https://admin.sevensbd.online",
  "https://sevens70-client.vercel.app",
  "https://sevens70-admin.vercel.app",
  "https://sevens70.vercel.app",
];

// Dynamic CORS middleware
const corsOptions = {
  origin: (origin, callback) => {
    console.log("Origin:", origin); // Debug logging
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  exposedHeaders: ["X-Total-Count"],
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Authorization", "Content-Type"],
};

// Middlewares
const server = express();
server.use(cookieParser());
server.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
  })
);
server.use(passport.initialize());
server.use(passport.session());

// CORS middleware
server.use(cors(corsOptions));

// Explicit preflight request handling
server.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.status(204).end(); // No Content response for preflight
});

// Prevent caching
server.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// JSON middleware
server.use(json());

// Routes
server.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});
server.use("/products", productRouter);
server.use("/categories", categoriesRouter);
server.use("/brands", brandsRouter);
server.use("/users", isAuth(), userRouter);
server.use("/auth", authRouter);
server.use("/cart", isAuth(), cartRouter);
server.use("/favourite", isAuth(), favouriteRouter);
server.use("/ratings", ratingsRouter);
server.use("/orders", isAuth(), orderRouter);
server.use("/order", landingPageOrderRouter);
server.use("/settings", settingsRouter);
server.use("/banner", bannerRouter);
server.use("/topbanner", topBannerRouter);
// server.use("/sunglassBanner", sunglassBannerRouter);
// server.use("/sunglassProduct", sunglassProductRouter);

server.use("/bkash", bkashRouter);

// Passport Strategies
passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: "Invalid credentials" });
      }
      pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        (err, hashedPassword) => {
          if (err || !timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "Invalid credentials" });
          }
          const token = jwt.sign(
            sanitizeUser(user),
            process.env.JWT_SECRET_KEY
          );
          done(null, { id: user.id, role: user.role, token });
        }
      );
    } catch (err) {
      done(err);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user));
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

passport.serializeUser((user, cb) => {
  process.nextTick(() => cb(null, { id: user.id, role: user.role }));
});

passport.deserializeUser((user, cb) => {
  process.nextTick(() => cb(null, user));
});

// Database connection and server start
main().catch((err) => console.error("Database connection error:", err));

async function main() {
  await connect(process.env.MONGODB_URL);
  console.log("Database connected");
}

server.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
