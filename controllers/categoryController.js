const Category = require("../models/Category");


// ➕ CREATE CATEGORY / SUBCATEGORY
exports.createCategory = async (req, res) => {
  try {
    const { name, slug, parent } = req.body;

    // 🔥 Check duplicate slug
    const exists = await Category.findOne({ slug });
    if (exists) {
      return res.status(400).json({ msg: "Category already exists" });
    }

    // 🔥 If parent is provided → validate it
    let parentCategory = null;

    if (parent) {
      parentCategory = await Category.findById(parent);

      if (!parentCategory) {
        return res.status(400).json({ msg: "Parent category not found" });
      }
    }

    const category = await Category.create({
      name,
      slug,
      parent: parentCategory ? parentCategory._id : null,
      image: req.file ? req.file.path : ""
    });

    res.json(category);
    console.log(category, data)

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error creating category" });
  }
};



// 📦 GET ALL MAIN CATEGORIES
exports.getMainCategories = async (req, res) => {
  try {
    const categories = await Category.find({ parent: null });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching categories" });
  }
};



// 📦 GET SUBCATEGORIES BY SLUG
exports.getSubCategories = async (req, res) => {
  try {
    const parent = await Category.findOne({ slug: req.params.slug });

    if (!parent) return res.json([]);

    const subcategories = await Category.find({
      parent: parent._id
    });

    res.json(subcategories);

  } catch (err) {
    res.status(500).json({ msg: "Error fetching subcategories" });
  }
};

exports.getAllCategories = async (req, res) => {
  try {

    const categories = await Category.find()
      .populate("parent", "name");

    res.json(categories);
    console.log(categories)

  } catch (err) {
    console.log(err);

    res.status(500).json({
      msg: "Error fetching categories"
    });
  }
};