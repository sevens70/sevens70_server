import { User } from "../model/User.js";
import { randomBytes, pbkdf2 } from "crypto";
import { sanitizeUser } from "../services/common.js";
import jwt from "jsonwebtoken";

export async function createUser(req, res) {
  console.log("sign req", req.body);
  try {
    const salt = randomBytes(16);
    pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const doc = await user.save();

        req.login(sanitizeUser(doc), (err) => {
          // this also calls serializer and adds to session
          if (err) {
            res.status(400).json(err);
          } else {
            const token = jwt.sign(
              sanitizeUser(doc),
              process.env.JWT_SECRET_KEY
            );
            res
              .cookie("jwt", token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true,
              })
              .status(201)
              .json({ id: doc.id, role: doc.role, name: doc.name });
          }
        });
      }
    );
  } catch (err) {
    console.log("error from auth controller", err);
    res.status(400).json(err);
  }
}

export async function loginUser(req, res) {
  const user = req.user;
  res
    .cookie("jwt", user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })
    .status(201)
    .json({ id: user.id, role: user.role, name: user?.name, token: user.token });
}

export async function logout(req, res) {
  res
    .cookie("jwt", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .sendStatus(200);
}

export async function checkAuth(req, res) {
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
}

// export async function resetPasswordRequest(req, res) {
//   const email = req.body.email;
//   const user = await User.findOne({ email: email });
//   if (user) {
//     const token = randomBytes(48).toString('hex');
//     user.resetPasswordToken = token;
//     await user.save();

//     // Also set token in email
//     const resetPageLink =
//       'http://localhost:3000/reset-password?token=' + token + '&email=' + email;
//     const subject = 'reset password for e-commerce';
//     const html = `<p>Click <a href='${resetPageLink}'>here</a> to Reset Password</p>`;

//     // lets send email and a token in the mail body so we can verify that user has clicked right link

//     if (email) {
//       const response = await sendMail({ to: email, subject, html });
//       res.json(response);
//     } else {
//       res.sendStatus(400);
//     }
//   } else {
//     res.sendStatus(400);
//   }
// }

// export async function resetPassword(req, res) {
//   const { email, password, token } = req.body;

//   const user = await User.findOne({ email: email, resetPasswordToken: token });
//   if (user) {
//     const salt = randomBytes(16);
//     pbkdf2(
//       req.body.password,
//       salt,
//       310000,
//       32,
//       'sha256',
//       async function (err, hashedPassword) {
//         user.password = hashedPassword;
//         user.salt = salt;
//         await user.save();
//         const subject = 'password successfully reset for e-commerce';
//         const html = `<p>Successfully able to Reset Password</p>`;
//         if (email) {
//           const response = await sendMail({ to: email, subject, html });
//           res.json(response);
//         } else {
//           res.sendStatus(400);
//         }
//       }
//     );
//   } else {
//     res.sendStatus(400);
//   }
// }
