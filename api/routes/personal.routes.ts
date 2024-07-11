import { get, create } from "../services/personal.service";
import express from "express";

const router = express.Router();

router.get("/:idUser", get);
router.post("/create", create);

module.exports = router;
