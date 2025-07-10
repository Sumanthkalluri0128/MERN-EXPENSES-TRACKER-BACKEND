const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const errorHandler = require("./middlewares/errorHandlerMiddleware");
const categoryRouter = require("./routes/categoryRouter");
const transactionRouter = require("./routes/transactionRouter");
const app = express();

//!connect to mongoose
mongoose
  .connect("mongodb+srv://admin:admin123@cluster0.cqvb3bk.mongodb.net/")
  .then(() => console.log("DB Connected"))
  .catch((e) => console.log(e));
//!cors config
const corsOption = {
  origin: ["http://127.0.0.1:5173"],
};
app.use(cors(corsOption));
//!middlewares
app.use(express.json());
//!Routes
app.use("/", userRouter);
app.use("/", categoryRouter);
app.use("/", transactionRouter);

//!Error
app.use(errorHandler);
//!start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on this port ${PORT}`));
