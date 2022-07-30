const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");
const app = express();
app.use([cors(), morgan("dev"), express.json()]);

app.use("/api/v1/tickets", routes);

app.get("/health", (_req, res) => {
  res.status(200).json({ message: "success" });
});

//Global Error handling
app.use((_req, _res, next) => {
  const error = new Error("Page Not Found");
  error.status = 404;
  next(error);
});

app.use((error, _req, res, _next) => {
  if (error.status) {
    return res.status(error.status).json({ message: error.message });
  }

  res.status(500).json({ message: "Internal Server Error" });
});

//port number declaration

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
