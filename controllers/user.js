function createUser(req, res, next) {
  res.json({ message: "User created" });
}

function generateOTP(req, res, next) {
  res.json({ message: "OTP generated" });
}

function verifyOTP(req, res, next) {
  res.json({ message: "OTP verified" });
}

module.exports = { createUser, generateOTP, verifyOTP };
