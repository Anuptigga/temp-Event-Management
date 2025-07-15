import express from "express";
import cors from "cors";
import eventRoutes from "./api/event/routes.js";
import userRoutes from "./api/user/routes.js";


const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/event',eventRoutes)
app.use('/api/user',userRoutes)

app.get("/", (req, res) => {
  res.send("Server working");
});

export default app;
