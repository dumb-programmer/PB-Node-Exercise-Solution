const crypto = require("crypto");
const moment = require("moment");

const User = require("../models/user");
const validateBody = require("../middleware/validateBody");
const { z } = require("zod");
const validateParams = require("../middleware/validateParams");
const validateQuery = require("../middleware/validateQuery");

const userSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name must be at least 1 character" })
    .max(255, { message: "Name cannot exceed 255 characters" }),
  phone_number: z.string().refine((value) => /^\d{11}$/.test(value), {
    message: "Phone number must be an 11-digit number",
  }),
});

const createUser = [
  validateBody(userSchema),
  async (req, res, next) => {
    const { phone_number, name } = req.body;

    try {
      const user = await User.findOne({
        where: {
          phone_number,
        },
      });

      if (user) {
        res
          .status(409)
          .json({ message: "A user with this phone number already exists" });
        return;
      }

      await User.create({ phone_number, name });

      res.json({ message: "User created" });
    } catch (error) {
      next(error);
    }
  },
];

const generateOTP = [
  validateBody(userSchema.omit({ name: true })),
  async (req, res, next) => {
    const { phone_number } = req.body;

    try {
      const user = await User.findOne({
        where: {
          phone_number,
        },
        attributes: ["id"],
      });

      if (!user) {
        return res.status(404).json({ message: "Invalid credentials" });
      }

      const otp = ("0000" + crypto.randomBytes(2).readUInt16BE(0)).slice(-4);

      const otp_expiration = moment().add(5, "minutes");

      await User.update({ otp, otp_expiration }, { where: { phone_number } });

      res.json({ user_id: user.id });
    } catch (error) {
      next(error);
    }
  },
];

const verifyOTP = [
  validateParams(
    z.object({ userId: z.string().uuid({ message: "Invalid UUID" }) })
  ),
  validateQuery(
    z.object({
      otp: z.string().refine((value) => /^\d{4}$/.test(value), {
        message: "otp must be a 4-digit number",
      }),
    })
  ),
  async function verifyOTP(req, res, next) {
    const { userId } = req.params;
    const { otp } = req.query;

    try {
      const user = await User.findOne({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ message: "No such user exists" });
      }

      const current_date = moment();

      if (user.otp_expiration > current_date && user.otp == otp) {
        return res.json({
          id: user.id,
          name: user.name,
          phone_number: user.phone_number,
        });
      } else if (user.otp_expiration < current_date) {
        return res.status(400).json({ message: "OTP expired" });
      }

      res.status(400).json({ message: "Invalid OTP" });
    } catch (error) {
      next(error);
    }
  },
];

module.exports = { createUser, generateOTP, verifyOTP };
