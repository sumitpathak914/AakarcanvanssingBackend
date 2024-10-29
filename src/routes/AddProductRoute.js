// Import necessary modules
const express = require('express');
const router = express.Router();
const multer = require('multer');
const app = express();
const productController = require('../controllers/AddProductController'); // Adjust the path as per your project structure
const authenticateToken = require('../middleware/auth');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Adjust the destination folder as per your project setup
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });
app.use(express.json({ limit: '100mb' })); // Increase the limit as needed
app.use(express.urlencoded({ limit: '100mb', extended: true }));
// Define routes with multer middleware
router.post('/addProducts', upload.array('selectedImages', 3), productController.createProduct); // Assuming 'selectedImages' is the field name for file upload

router.get('/GetProducts', authenticateToken, productController.getAllProducts);
router.get('/getEcommerceProducts', productController.getAllProductsForEcommerceNew);
router.post('/GetSingleproducts', authenticateToken, productController.getProductById);
router.post('/GetSingleproductsForEcommerce', productController.getProductByIdForEcommerce);
router.put('/updateProduct/:id', authenticateToken, productController.updateProductById);
router.delete('/products/:id', authenticateToken, productController.deleteProductById);
router.post('/updateVisibility', authenticateToken, productController.updateVisibility);
router.post('/updatePrice', authenticateToken, productController.updatePrice);
router.get('/FactoryProductList/:factoryId', authenticateToken, productController.getProductsByFactoryId);
router.post('/ProductDetailsForOrder', productController.getProductsByIdsForViewOrders);
router.get('/getEcommerceProductsShop', productController.getAllProductsForEcommerce);

router.post('/WishlistAdd', productController.addToFavorite);
router.delete('/remove-from-favorite', productController.removeFromFavorites);
router.get('/wishlist/:shopId', productController.getWishlistProducts);
module.exports = router;
