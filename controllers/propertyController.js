const Property = require("../models/Property")

const createProperty = async (req, res) => {
  try {
    const property = await Property.create({
      ...req.body,
      ownerId: req.session.user._id,
    })
    res.send(property)
  } catch (error) {
    console.error(
      ":warning: An error has occurred creating a property!",
      error.message
    )
  }
}
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({})
    res.render("property/all", { properties })
  } catch (error) {
    console.error(
      ":warning: An error has occurred getting all properties!', error.message"
    )
  }
}

const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)

    res.render("property/show", { property })
  } catch (error) {
    console.error(
      ":warning: An error has occurred getting a property!",
      error.message
    )
  }
}

const updatePropertyById = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
    })
    res.redirect(`/properties/${req.params.id}`)
  } catch (error) {
    console.error(
      ":warning: An error has occurred updating a property!",
      error.message
    )
  }
}

const deletePropertyById = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id)
    res.send(
      `🗑️ Property with ID ${req.params.id} has been deleted successfully!`
    )
  } catch (error) {
    console.error(
      ":warning: An error has occurred deleting a property!",
      error.message
    )
  }
}

const getEditPage = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)

    res.render("property/edit", { property })
  } catch (error) {
    console.error(
      "⚠️ An error has occurred getting edit page!",
      error.message
    )
    res.status(500).send("Something went wrong")
  }
}

module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updatePropertyById,
  deletePropertyById,
  getEditPage
}
