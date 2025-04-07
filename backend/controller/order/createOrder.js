const Order = require("../../models/Order");

const createOrderController = async (req, res) => {
  try {
    const { name, phone, address, pincode, city, totalQty, totalPrice } = req.body;
  //  console.log('body data');
//    console.log(req.body);
    const currentUser = req.userId;
   // console.log(currentUser);

    // Validate required fields
    if (!name || !phone || !address || !pincode || !city || !totalQty || !totalPrice) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Create new order
    const newOrder = new Order({
      name,
      phone,
      address,
      pincode,
      city,
      totalQty,
      totalPrice,
      userId: currentUser, // Get the user ID from the authenticated user
    });


    await newOrder.save();
    res.status(201).json({success : true, message: "Order placed successfully!", order: newOrder });
  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

module.exports = createOrderController;
