const Property = require("../../models/property.model");

const fetchProperties = async (req, res) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    const fetchAll = req.query.all === "true"; 

    console.log("✅ Fetching properties");
    console.log("User ID:", userId);
    console.log("User Role:", userRole);
    console.log("Fetch All:", fetchAll);

    let properties;

    if (userRole === "admin" || userRole === "user"  || (userRole === "owner" && fetchAll)) {

      properties = await Property.find({});
    } else if (userRole === "owner") {
   
      properties = await Property.find({ ownerId: userId });
    } else {
      
      properties = []; 
    }

    res.status(200).json({ success: true, properties });
  } catch (error) {
    console.error("❌ Error fetching properties:", error);
    res.status(500).json({ success: false, message: "Error fetching properties" });
  }
};

module.exports = fetchProperties;


