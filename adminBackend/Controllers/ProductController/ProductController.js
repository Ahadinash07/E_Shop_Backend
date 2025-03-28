const { uploadToS3 } = require("../../middleware/awsmiddleware");
const db = require("../../Models/db");
const env = require("dotenv");
const { v4: uuidv4 } = require('uuid');
env.config();

const AddProductController = async (req, res) => {
  const { retailerId, productName, description, category, subcategory, brand, quantity, price } = req.body;

  if (!retailerId || !productName || !description || !category || !subcategory || !brand || !quantity || !price) {
      return res.status(400).json({ message: 'All product fields are required' });
  }

  if (!req.files || !req.files['images']) {
      return res.status(400).json({ message: 'Product images are required' });
  }

  try {
      const imageFiles = req.files['images'];
      const imageUrls = await Promise.all(
          imageFiles.map(async (file) => await uploadToS3(file))
      );

      let videoUrl = null;
      if (req.files['video'] && req.files['video'][0]) {
          videoUrl = await uploadToS3(req.files['video'][0]);
      }

      const productId = uuidv4();
      const addedAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

      const insertProductQuery = ` INSERT INTO product (productId, retailerId, productName, description, category, subcategory, brand, quantity, price, images, videoUrl, addedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      
      db.query( insertProductQuery, [ productId,  retailerId,  productName,  description,  category,  subcategory,  brand,  quantity,  price,  JSON.stringify(imageUrls),  videoUrl,  addedAt ], (err, result) => {
              if (err) {
                  console.error('Database Error:', err);
                  return res.status(500).json({ message: 'Error in adding product' });
              }
              
              const product = { productId, retailerId, productName, description, category, subcategory, brand, quantity: parseInt(quantity), price: parseFloat(price), images: imageUrls, videoUrl, addedAt };
              
              return res.status(201).json({ success: true,message: 'Product added successfully',product });
          }
      );
  } catch (error) {
      console.error('Error in AddProductController:', error);
      return res.status(500).json({  success: false, message: 'Internal server error' });
  }
};



const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing' });
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

const GetRetailerProductsController = async (req, res) => {
    const { retailerId } = req.params;
  
    try {
      const getProductsQuery = `SELECT productId, productName, description, category, subcategory, brand, quantity, price, addedAt FROM product WHERE retailerId = ?`;
      db.query(getProductsQuery, [retailerId], (err, results) => {
        if (err) {
          console.error("Database Error:", err);
          return res.status(500).json({ message: 'Database error' });
        }
        if (results.length === 0) {
          return res.status(404).json({ message: 'No products found for this retailer.' });
        }
        return res.status(200).json({ products: results });
      });
    } catch (error) {
      console.error("Server Error:", error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };



module.exports = { AddProductController, GetRetailerProductsController, authenticateToken };