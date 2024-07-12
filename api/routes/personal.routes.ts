import { verifyToken } from "../middleware/verifyToken";
import { get, create } from "../services/personal.service";
import express from "express";

const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/:idUser", verifyToken, get);

module.exports = router;
