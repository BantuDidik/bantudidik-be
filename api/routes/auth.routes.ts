import { verifyToken } from "../middleware/verifyToken";
import { login, logout, signup } from "../services/auth.service";
import express from "express";

const router = express.Router();

router.post("/login", login);
router.post("/logout", verifyToken, logout);
router.post("/signup", signup);

module.exports = router;
