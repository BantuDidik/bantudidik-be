import { verifyToken } from "../middleware/verifyToken";
import { create, get, list, check} from "../services/funding.service";
import express from "express";

const router = express.Router();

router.post("/create", verifyToken,create);
router.get("/list", verifyToken, list);
router.post("/check", verifyToken, check)
router.get("/:idFunding", verifyToken, get);

module.exports = router;
