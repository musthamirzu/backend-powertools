const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const upload = require("../middleware/upload");

const { createProduct, getProducts, createBulkProductsWithImages, updateProduct, deleteProduct } = require("../controllers/productController");

router.get("/", getProducts);
router.post("/create", auth, admin, upload.single("image"), createProduct);

router.put("/:id", auth, admin, upload.single("image"), updateProduct);


router.delete("/:id", auth, admin, deleteProduct);
module.exports = router;