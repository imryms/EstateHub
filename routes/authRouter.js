const express = require("express")
const router = express.Router()

const { isLoggedIn } = require("../middleware/index")
const authController = require("../controllers/authController.js")

router.post("/sign-up", authController.registerUser)
router.post("/log-in", authController.logInUser)
router.get("/sign-out", authController.signOutUser)
router.put("/change-password", isLoggedIn, authController.changePassword)

router.get("/sign-up", (req, res) => {
  res.render("./auth/sign-up")
})

router.get("/log-in", (req, res) => {
  res.render("./auth/log-in")
})

router.get("/:id/change-password", (req, res) => {
  res.render("./auth/change-password")
})
module.exports = router
