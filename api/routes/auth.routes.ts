import { login, logout, signup } from "../services/auth.service";
import express from "express";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/signup", signup);

module.exports = router;
