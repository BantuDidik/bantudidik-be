require("dotenv").config();
import express from "express";
import cors from "cors";

const PORT: string = process.env.PORT!;

const app = express();

const whitelist: string[] = [];

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
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Garuda Hacks 5.0');
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});