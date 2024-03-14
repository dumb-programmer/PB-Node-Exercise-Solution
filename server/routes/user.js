const router = require("express").Router();

const { createUser, generateOTP, verifyOTP } = require("../controllers/user");

router.post("/", createUser);
router.post("/generateOTP", generateOTP);
router.get("/:userId/verifyOTP", verifyOTP);

module.exports = router;
