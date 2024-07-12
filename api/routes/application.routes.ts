import { verifyToken } from "../middleware/verifyToken";
import { create, accept, complete, list, get } from "../services/application.service";
import express from "express";

const router = express.Router();

router.post("/create", verifyToken, create);

router.post("/accept", verifyToken, accept);
router.post("/complete", verifyToken, complete);

router.get("/list", verifyToken, list);
router.get("/:idApplication", verifyToken, get);

module.exports = router;
