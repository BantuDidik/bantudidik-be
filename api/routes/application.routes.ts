import { verifyToken } from "../middleware/verifyToken";
import { create, pending, accept, list, get } from "../services/application.service";
import express from "express";

const router = express.Router();

router.post("/create", verifyToken, create);

router.post("/pending", verifyToken, pending);
router.post("/accept", verifyToken, accept);

router.get("/list", verifyToken, list);
router.get("/:idApplication", verifyToken, get);

module.exports = router;
