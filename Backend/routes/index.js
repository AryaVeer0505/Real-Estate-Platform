const router = require("express").Router();

const apiRoutes = require("./api/index.js");

router.use("/api", apiRoutes);

router.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "The route you are trying to access does not exist.",
  });
});

module.exports = router;
