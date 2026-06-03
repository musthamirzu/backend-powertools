const router = require("express").Router();
const upload = require("../middleware/upload");
const {
  createCategory,
  getMainCategories,
  getSubCategories,
  getAllCategories
} = require("../controllers/categoryController");

// ➕ Create category / subcategory
router.post("/create", upload.single("image"), createCategory);

router.get("/all", getAllCategories);
// 📦 Get only main categories (parent = null)
router.get("/", getMainCategories);

// 📦 Get subcategories by slug
router.get("/:slug", getSubCategories);



module.exports = router;