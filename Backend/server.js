const mongoose = require("mongoose");
const routes = require("./routes");
const express = require("express");
const backend = express();
const cors = require("cors")

backend.use(express.json());

backend.use(cors({
    origin: "*",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  })
);

  backend.use(routes);

mongoose.connect("mongodb+srv://aryaveerk123:kmFs1Il9x1GAA2su@backend-pi.5edpy.mongodb.net/test")
.then(() =>
    console.log("Mongo Connected")
  )
  .then(() => {
    const PORT = 5001;
    backend.listen(PORT, () => {
      console.log("Server started on port", (PORT));
    });
  })
  .catch((err) => console.log(err));