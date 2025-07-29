const imagekit = require('../config/imagekit');
const productModel = require('../models/product.model');

module.exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price } = req.body;

    if (!name || !description || !price || !req.files?.length) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Upload images to ImageKit
    const imageUploadPromises = req.files.map((file) =>
      imagekit.upload({
        file: file.buffer,
        fileName: `${Date.now()}-${file.originalname}`,
        folder: "/ecommerce_uploads"
      })
    );

    const uploadResults = await Promise.all(imageUploadPromises);
    const imageUrls = uploadResults.map((img) => img.url);

    const product = await productModel.create({
      name,
      description,
      price,
      images: imageUrls,
      seller: req.user._id,
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (err) {
    next(err);
  }
};


