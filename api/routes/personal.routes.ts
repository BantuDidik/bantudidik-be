import { verifyToken } from "../middleware/verifyToken";
import { get, create } from "../services/personal.service";
import express from "express";

const router = express.Router();

router.get("/:idUser", verifyToken, get);
router.post("/create", verifyToken, create);

module.exports = router;
