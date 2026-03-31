const express = require("express")
const router = express.Router()

const propertyController = require("../controllers/propertyController.js")

const { isLoggedIn, isOwner, isPropertyOwner } = require("../middleware")

router.get("/", propertyController.getAllProperties)
router.get(
  "/my/listings",
  isLoggedIn,
  isOwner,
  propertyController.getMyProperties
)

router.get("/new", isLoggedIn, isOwner, (req, res) => {
  res.render("property/new")
})

router.post("/", isLoggedIn, isOwner, propertyController.createProperty)

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  isPropertyOwner,
  propertyController.getEditPage
)

router.get("/:id", propertyController.getPropertyById)

router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  isPropertyOwner,
  propertyController.updatePropertyById
)

router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  isPropertyOwner,
  propertyController.deletePropertyById
)

module.exports = router
