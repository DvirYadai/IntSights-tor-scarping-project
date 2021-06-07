const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/user", userController.user_post);
router.get("/user", userController.user_get);
router.put("/user/update", userController.user_update);

module.exports = router;
