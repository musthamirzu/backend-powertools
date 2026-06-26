const router = require("express").Router();
const upload = require("../middleware/upload");
const {
  createCategory,
  getMainCategories,
  getSubCategories,
  getAllCategories,
  updateCategory,
  getMenu

} = require("../controllers/categoryController");
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
// ➕ Create category / subcategory
router.post("/create", upload.single("image"), createCategory);

router.get("/all", getAllCategories);
// 📦 Get only main categories (parent = null)
router.get("/", getMainCategories);
router.get("/menu", getMenu);
// 📦 Get subcategories by slug


router.put(
  "/:id",
  upload.single("image"),auth,admin,
  updateCategory
);

// 📦 Get menu

router.get("/:slug", getSubCategories);
module.exports = router;