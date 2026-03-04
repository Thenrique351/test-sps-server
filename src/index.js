require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes");

// Fallback para JWT_SECRET se não definido no .env
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "spsgroup_default_secret_key";
  console.log("⚠️ AVISO: JWT_SECRET não definido. Usando valor padrão (desenvolvimento apenas!)");
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT || 3001}`);
});
