const express = require("express");
const router = express.Router();
const dataController = require("../controllers/dataController");

router.get("/data", dataController.data_get);

module.exports = router;
