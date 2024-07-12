import { verifyToken } from "../middleware/verifyToken";
import { execute } from "../services/ai.screening.service";
import express from "express";

const router = express.Router();

router.post("/", verifyToken, execute);

module.exports = router;
