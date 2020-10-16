import { config } from "dotenv";
import { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { mkdirSync } from "fs";
import multer from "multer";
import User from "../models/user.model";
import bcrypt from "bcrypt";

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

router.get(`/`, async (req: Request, res: Response) => {
  try {
    let users = await User.find({});
    res.json({ users });
  } catch (error) {
    res.status(500).json({ errors: [{ msg: "Server error" }] });
  }
});

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
  async (req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "email is taken", param: "email" }] });
      }

      user = await User.findOne({ username: req.body.username });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "username is taken", param: "username" }] });
      }

      user = new User({ ...req.body });

      let salt = await bcrypt.genSalt(10);
      // @ts-ignore
      user.password = await bcrypt.hash(req.body.password, salt);

      await user.save();

      user = await User.findById(user.id).select("-password");
      res.json({ user });
    } catch (error) {
      console.log(error);
      res.status(500).json({ errors: [{ msg: "Server error" }] });
    }
  }
);

export default router;
