require("dotenv").config();
import express from "express";

const PORT: string = process.env.PORT!;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send('Garuda Hacks 5.0');
});

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});