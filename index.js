import "dotenv/config";
import express, { raw, static as serveStatic, json } from "express";
const server = express();
import { connect } from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { pbkdf2, timingSafeEqual } from "crypto";
import jwt from "jsonwebtoken"; // Use default import for jsonwebtoken
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import cookieParser from "cookie-parser";

// Destructure from the default passport and jwt imports

import { productRouter } from "./routes/Products.js";
import { authRouter } from "./routes/Auth.js";
import { User } from "./model/User.js";
import { isAuth, sanitizeUser, cookieExtractor } from "./services/common.js";
// import { resolve } from "path";
import { categoriesRouter } from "./routes/Categories.js";
import { brandsRouter } from "./routes/Brands.js";
import { userRouter } from "./routes/Users.js";
import { cartRouter } from "./routes/Cart.js";
import { orderRouter } from "./routes/Order.js";
import { favouriteRouter } from "./routes/Favourite.js";
import { settingsRouter } from "./routes/Settings.js";
import { bannerRouter } from "./routes/Banner.js";
import { topBannerRouter } from "./routes/TopBanner.js";

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
];
// Middlewares
server.use(cookieParser());
server.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
  })
);
server.use(passport.initialize());
server.use(passport.session());
server.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    exposedHeaders: ["X-Total-Count"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

server.use(json()); // to parse req.body

server.use("/products", productRouter);
server.use("/categories", categoriesRouter);
server.use("/brands", brandsRouter);
server.use("/users", isAuth(), userRouter);
server.use("/auth", authRouter);
server.use("/cart", isAuth(), cartRouter);
server.use("/favourite", isAuth(), favouriteRouter);
server.use("/orders", isAuth(), orderRouter);
server.use("/settings", settingsRouter);
server.use("/banner", bannerRouter);
server.use("/topbanner", topBannerRouter);

// Passport Strategies
passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    // by default passport uses username
    try {
      // console.log("user 01", await User.find({}));
      const user = await User.findOne({ email: email });
      if (!user) {
        return done(null, false, { message: "invalid credentials" }); // for safety
      }
      pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "invalid credentials" });
          }
          const token = jwt.sign(
            sanitizeUser(user),
            process.env.JWT_SECRET_KEY
          );
          done(null, { id: user.id, role: user.role, token }); // this lines sends to serializer
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
        return done(null, sanitizeUser(user)); // this calls serializer
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

// this creates session variable req.user on being called from callbacks
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

main().catch((err) => console.log(err));

async function main() {
  await connect(process.env.MONGODB_URL);
  console.log("database connected");
}

server.listen(process.env.PORT, () => {
  console.log("server started");
});
