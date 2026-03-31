const Property = require("../models/Property")

const createProperty = async (req, res) => {
  try {
    const property = await Property.create({
      ...req.body,
      ownerId: req.session.user._id,
      images: req.body.images ? [req.body.images] : [],
    })

    res.redirect(`/properties/${property._id}`)
  } catch (error) {
    console.error(
      ":warning: An error has occurred creating a property!",
      error.message
    )
    // res.redirect("properties/new")
  }
}

const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: "active" })
    res.render("property/all", { properties })
  } catch (error) {
    console.error(
      ":warning: An error has occurred getting all properties!",
      error.message
    )
  }
}

const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      ownerId: req.session.user._id,
    })

    res.render("property/all", { properties })
  } catch (error) {
    console.error(
      ":warning: An error has occurred getting my properties!",
      error.message
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
    const updatedData = {
      ...req.body,
    }

    if (req.body.images) {
      updatedData.images = [req.body.images]
    }

    await Property.findByIdAndUpdate(req.params.id, updatedData, {
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
    res.redirect("/properties")
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
      ":warning: An error has occurred getting edit page!",
      error.message
    )
    res.status(500).send("Something went wrong")
  }
}

const getPropertiesByType = async (req, res) => {
  try {
    const properties = await Property.find({ type: req.params.type })

    res.render("property/all", { properties })
  } catch (error) {
    console.error("Error filtering properties:", error.message)
    res.status(500).send("Something went wrong")
  }
}

module.exports = {
  createProperty,
  getAllProperties,
  getMyProperties,
  getPropertyById,
  updatePropertyById,
  deletePropertyById,
  getEditPage,
  getPropertiesByType,
}
