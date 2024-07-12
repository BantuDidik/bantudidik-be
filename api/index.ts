require("dotenv").config();
import express from "express";
import cookieParser from 'cookie-parser';

import cors from "cors";

const PORT: string = process.env.PORT!;

const app = express();

const whitelist: string[] = [];

const PROD = process.env.PROD_CLIENT_URL

if (PROD) {
    whitelist.push(PROD)
}

const corsOptions: cors.CorsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (error: Error | null, allow?: boolean) => void
  ) {
    if (!origin || whitelist.length === 0 || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', require("../api/routes/auth.routes"))
app.use('/personal', require("../api/routes/personal.routes"))
app.use('/funding', require("../api/routes/funding.routes"))
app.use('/application', require("../api/routes/application.routes"))

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});