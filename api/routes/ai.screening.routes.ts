import { execute } from "../services/ai.screening.service";
import express from "express";

const router = express.Router();

router.post("/:idFunding", execute);

module.exports = router;
