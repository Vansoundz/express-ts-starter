import { config } from "dotenv";
import express from "express";
import { connect, connection } from "mongoose";
import users from "./routes/user.route";

config();

const app = express();
const PORT = process.env.PORT || 5000;
const mongoURI: string = process.env.MONGO_URI as string;

// Middleware
app.use(express.json());

// async () => {
//   try {
connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
connection.once("open", () => console.log("Connected to db"));
connection.on("error", () => server.close());

app.get("/", (req, res) => {
  res.send({ date: Date.now() });
});

app.use(`/users`, users);

var server = app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
//   } catch (error) {
//     console.log("Error", error);
//   }
// };
