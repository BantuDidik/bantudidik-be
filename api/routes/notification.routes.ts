import { verifyToken } from "../middleware/verifyToken";
import { list } from "../services/notification.service";
import express from "express";

const router = express.Router();

router.get("/list", verifyToken, list);

module.exports = router;
