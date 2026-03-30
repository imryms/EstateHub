const express = require("express")
const router = express.Router()

const propertyController = require("../controllers/propertyController.js")

router.get("/all", propertyController.getAllProperties)

router.get("/new", (req, res) => {
  res.render("property/new")
})

router.get("/edit", (req, res) => {
  res.render("property/edit")
})

router.get("/show", (req, res) => {
  res.render("property/show")
})

router.post("/", propertyController.createProperty)
router.put("/:id", propertyController.updatePropertyById)
router.delete("/:id", propertyController.deletePropertyById)
router.get("/:id", propertyController.getPropertyById)

module.exports = router
