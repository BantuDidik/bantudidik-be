import { signup } from "../services/auth.service";
import express from "express";

const router = express.Router();

router.post("/signup", signup);

module.exports = router;