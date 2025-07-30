const imagekit = require('../config/imagekit');
const productModel = require('../models/product.model');

module.exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !description || !price || !req.files?.length) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const uploadPromises = req.files.map((file) =>
      imagekit.upload({
        file: file.buffer,
        fileName: `${Date.now()}-${file.originalname}`,
        folder: "/ecommerce_uploads"
      })
    );

    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map(result => result.url);

    const product = await productModel.create({
      name,
      description,
      price,
      images: imageUrls,
      seller: req.user._id, // Make sure req.user is set by authentication middleware
    });

    res.status(201).json({
      message: "Product created successfully",
      product
    });
  } catch(error) {
    console.error("Image Upload Error:", error.message);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};


