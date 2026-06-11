const cloudinary = require("../config/cloudinary");
const Product = require("../models/Product");
const Category = require("../models/Category");

exports.createProduct = async (req, res) => {
  try {
    // 🔥 Convert slug → ObjectId
    const categoryDoc = await Category.findOne({
      slug: req.body.category
    });

    if (!categoryDoc) {
      return res.status(400).json({
        msg: `Category not found: ${req.body.category}`
      });
    }

    const product = await Product.create({
      name: req.body.name,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      brand: req.body.brand,
      category: categoryDoc._id, // ✅ FIX
      image: req.file ? req.file.path : "",
      description: req.body.description,
      tag: req.body.tag,
    });

    res.json(product);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error creating product" });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;

    let filter = {};

    // 🔍 Search
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category) {
      // 🔥 find selected category
      const cat = await Category.findOne({ slug: category });

      if (!cat) return res.json([]);

      // 🔥 find all subcategories of this category
      const subCategories = await Category.find({ parent: cat._id });

      // 👉 collect all IDs (parent + children)
      const categoryIds = [cat._id];

      if (subCategories.length > 0) {
        categoryIds.push(...subCategories.map(c => c._id));
      }

      // 🔥 match products in parent OR children
      filter.category = { $in: categoryIds };
    }

    const products = await Product.find(filter).populate("category");

    res.json(products);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error fetching products" });
  }
};



exports.updateProduct = async (req, res) => {
  try {

    const updateData = {
      name: req.body.name,
      price: Number(req.body.price),
      stock: Number(req.body.stock),
      brand: req.body.brand,
      description: req.body.description,
      tag: req.body.tag,
    };


    if (req.file) {
      updateData.image = req.file.path;
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error updating product" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // 🔥 Extract public_id from URL
    const publicId = product.image.split("/").pop().split(".")[0];

    await cloudinary.uploader.destroy(`powertools_products/${publicId}`);

    await Product.findByIdAndDelete(req.params.id);

    res.json({ msg: "Product deleted + image removed" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error deleting product" });
  }
};

exports.getBestSellers = async (
  req,
  res
) => {
  try {

    const products =
      await Product.find({
        tag: "BEST_SELLER"
      })
        .populate("category")
        .limit(5);

    res.json(products);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      msg:
        "Error fetching best sellers",
    });

  }
};


exports.toggleBestSeller =
  async (req, res) => {
    try {

      const product =
        await Product.findById(
          req.params.id
        );

      if (!product) {
        return res
          .status(404)
          .json({
            msg:
              "Product not found",
          });
      }

      product.isBestSeller =
        !product.isBestSeller;

      await product.save();

      res.json({
        msg:
          "Best seller updated",
        product,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        msg:
          "Server Error",
      });

    }
  };

  exports.getNewArrivals =
  async (req, res) => {
    try {

      const products =
        await Product.find({
          tag: "NEW_ARRIVAL"
        })
        .populate("category")
        .limit(8);

      res.json(products);

    } catch (err) {

      res.status(500).json({
        msg: "Server Error"
      });

    }
  };

  exports.getBrands = async (req, res) => {
  try {

    const brands =
      await Product.distinct("brand");

    res.json(brands);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      msg: "Error fetching brands",
    });

  }
};


exports.getProductsByBrand =
  async (req, res) => {
    try {

      const products =
        await Product.find({
          brand: req.params.brand,
        });

      res.json(products);

    } catch (err) {

      console.log(err);

      res.status(500).json({
        msg:
          "Error fetching brand products",
      });

    }
  };