import { config } from "dotenv";
import { Router } from "express";
import { check } from "express-validator";
import { mkdirSync } from "fs";
import multer from "multer";
import {
  getUser,
  login,
  register,
  updateProfile,
} from "../controllers/user.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

config();

// var s3 = new S3({
//   accessKeyId: process.env.AWSAccessKeyId,
//   secretAccessKey: process.env.AWSSecretKey,
// });

// var upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: "moonre",
//     metadata: function (req, file, cb) {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: function (req, file, cb) {
//       cb(null, `${Date.now()}${file.originalname}`);
//     },
//   }),
// });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // @ts-ignore
    const path = `./src/files/`;
    mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });
// const singleUpload = upload.single("image");

router.get(`/`, getUser);

router.post(
  `/register`,
  [
    check("username").notEmpty().withMessage("username is required"),
    check("email").notEmpty().withMessage("email is required"),
    check("password").notEmpty().withMessage("password is required"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("password should be more than 6 characters long"),
    check("email").isEmail().withMessage("email is invalid"),
  ],
  register
);

router.post("/login", login);

router.post("/", [authMiddleware, upload.single("image")], updateProfile);

export default router;
