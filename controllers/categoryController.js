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

exports.getMenu = async (req, res) => {
  try {

    const mainCategories = await Category.find({
      parent: null,
    }).lean();

    const subCategories = await Category.find({
      parent: { $ne: null },
    }).lean();

    const menu = mainCategories.map(main => ({
      ...main,
      children: subCategories.filter(
        sub =>
          sub.parent.toString() ===
          main._id.toString()
      ),
    }));

    res.json(menu);

  } catch (err) {
    res.status(500).json({
      msg: "Error fetching menu",
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        msg: "Category not found",
      });
    }

    // Prevent duplicate slug
    const exists = await Category.findOne({
      slug,
      _id: { $ne: req.params.id },
    });

    if (exists) {
      return res.status(400).json({
        msg: "Category slug already exists",
      });
    }

    category.name = name;
    category.slug = slug;

    if (req.file) {
      category.image = req.file.path;
    }

    await category.save();

    res.json({
      msg: "Category updated successfully",
      category,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      msg: "Error updating category",
    });
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