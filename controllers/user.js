const User = require("../models/user");

async function createUser(req, res, next) {
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
}

function generateOTP(req, res, next) {
  res.json({ message: "OTP generated" });
}

function verifyOTP(req, res, next) {
  res.json({ message: "OTP verified" });
}

module.exports = { createUser, generateOTP, verifyOTP };
