import { verifyToken } from "../middleware/verifyToken";
import { create, list } from "../services/appreciation.service";
import express from "express";

const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/list", verifyToken, list);

module.exports = router;
