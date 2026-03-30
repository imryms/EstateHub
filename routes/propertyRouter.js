const express = require("express")
const router = express.Router()

const propertyController = require("../controllers/propertyController.js")

router.get("/", propertyController.getAllProperties)

router.get("/new", (req, res) => {
  res.render("property/new")
})

router.get("/:id/edit", propertyController.getEditPage)
router.get("/:id", propertyController.getPropertyById)

router.post("/", propertyController.createProperty)
router.put("/:id", propertyController.updatePropertyById)
router.delete("/:id", propertyController.deletePropertyById)

module.exports = router
