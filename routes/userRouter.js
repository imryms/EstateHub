const express = require("express")
const router = express.Router()

const {isLoggedIn} = require("../middleware/index")
const userController = require("../controllers/userController")



router.get("/:id", isLoggedIn, userController.getUserById)

module.exports = router
