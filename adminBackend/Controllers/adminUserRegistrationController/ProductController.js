const db = require('../../Models/db');

const GetAllProducts = (req, res) => {
  const sqlQuery = `
    SELECT p.*, r.Retailer_Name, pd.colors, pd.sizes, pd.weight, pd.dimensions, pd.materials, pd.features
    FROM product p
    LEFT JOIN RetailerRegistration r ON p.retailerId = r.retailerId
    LEFT JOIN product_descriptions pd ON p.productId = pd.productId
  `;
  db.query(sqlQuery, (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database Error', error: err.message });
    }
    res.status(200).json({ data: result });
  });
};

const GetProductById = (req, res) => { 
  const id = req.params.productId;
  const sqlQuery = `
    SELECT p.*, r.Retailer_Name, pd.colors, pd.sizes, pd.weight, pd.dimensions, pd.materials, pd.features
    FROM product p
    LEFT JOIN RetailerRegistration r ON p.retailerId = r.retailerId
    LEFT JOIN product_descriptions pd ON p.productId = pd.productId
    WHERE p.productId = ?
  `;
  db.query(sqlQuery, id, (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database Error', error: err.message });
    }
    if (!result.length) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ data: result[0] });
  });
};

const UpdateProductStatus = (req, res) => {
  const id = req.params.productId;
  const { status } = req.body;
  const sqlQuery = `UPDATE product SET status = ? WHERE productId = ?`;
  db.query(sqlQuery, [status, id], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ message: 'Database Error', error: err.message });
    }
    res.status(200).json({ message: 'Product Status Updated Successfully' });
  });
};

module.exports = { 
  GetAllProducts, 
  GetProductById,
  UpdateProductStatus
};