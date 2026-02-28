const isLoggedIn = (req,res, next) => {
  if(!req.session.user){
    return res.send("Please log in first")
  }
  next()
}

const isClient = (req, res, next) => {
  if(req.session.user?.role !== "client"){
    return res.send("Clients only")
  }
  next()
}


const isOwner = (req, res, next) => {
  if(req.session.user?.role !== "owner"){
    return res.send("Owner only")
  }
  next()
}

const Property = require("../models/Property");

const isPropertyOwner = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).send("Property not found");
    }

    if (property.ownerId.toString() !== req.session.user._id.toString()) {
      return res.status(403).send("Not your property");
    }

    next();
  } catch (error) {
    next(error);
  }
};
