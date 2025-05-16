const db = require('../../Models/db');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const env = require('dotenv');
env.config();


const RetailerRegistationController = async (req, res) => {
    const { Retailer_Name, email, password } = req.body;

    try {
        const checkUserQuery = `SELECT * FROM RetailerRegistration WHERE email = ?`;
        db.query(checkUserQuery, [email], async (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database error' });
            }

            if (results.length > 0) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const insertUserQuery = `INSERT INTO RetailerRegistration (retailerId, Retailer_Name, email, password) VALUES (UUID(), ?, ?, ?)`;
            db.query(insertUserQuery, [Retailer_Name, email, hashedPassword], (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Error in retailer registration' });
                }
                return res.status(201).json({ message: 'User registered successfully', result });
            });
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const RetailerLoginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUserQuery = `SELECT * FROM RetailerRegistration WHERE email = ?`;
    db.query(checkUserQuery, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: 'User not found' });
      }

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const updateStatusQuery = `UPDATE RetailerRegistration SET status = 'Active' WHERE retailerId = ?`;
      db.query(updateStatusQuery, [user.retailerId], (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Error updating status' });
        }

        const token = jwt.sign(
          { retailerId: user.retailerId, role: 'retailer' }, // Add role
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        return res.status(200).json({
          message: 'Login successful',
          token,
          retailer: {
            retailerId: user.retailerId,
            Retailer_Name: user.Retailer_Name,
            email: user.email,
          },
        });
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


const RetailerLogoutController = async (req, res) => {
    const { retailerId } = req.body;

    if (!retailerId) {
        return res.status(400).json({ message: 'Retailer ID is required' });
    }

    try {
        const updateStatusQuery = `UPDATE RetailerRegistration SET status = 'Inactive' WHERE retailerId = ?`;
        
        db.query(updateStatusQuery, [retailerId], (err, result) => {
            if (err) {
                console.error('Error updating status:', err);
                return res.status(500).json({ message: 'Error updating status' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Retailer not found' });
            }

            return res.status(200).json({ message: 'Logout successful' });
        });
    } catch (error) {
        console.error('Internal server error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const RetailerUpdateController = async (req, res) => {
    const { Retailer_Name, email, password } = req.body;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const updateUserQuery = `UPDATE RetailerRegistration SET Retailer_Name = ?, email = ?, password = ? WHERE retailerId = ?`;
        db.query(updateUserQuery, [ Retailer_Name, email, hashedPassword, req.params.retailerId ], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database error' });
            }
            return res.status(200).json({ message: 'User updated successfully' });
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const RetailerUpdatePasswordController = async (req, res) => {
    const { password } = req.body;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const updatePasswordQuery = `UPDATE RetailerRegistration SET password = ? WHERE retailerId = ?`;
        db.query(updatePasswordQuery, [hashedPassword, req.params.retailerId], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database error' });
            }
            return res.status(200).json({ message: 'Password updated successfully' });
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const RetailerDeleteController = async (req, res) => {
    const deleteUserQuery = `DELETE FROM RetailerRegistration WHERE retailerId = ?`;
    db.query(deleteUserQuery, [req.params.retailerId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        return res.status(200).json({ message: 'User deleted successfully' });
    });
};


const getRetailerDetails = async (req, res) => {
    const getRetailerQuery = `SELECT retailerId, Retailer_Name, email, status, Registered_at FROM RetailerRegistration WHERE retailerId = ?`;
    db.query(getRetailerQuery, [req.params.retailerId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        return res.status(200).json({ message: 'Retailer details', result });
    });
};


const RetailerUpdateStatusController = async (req, res) => {
    const { status } = req.body;

    const updateStatusQuery = `UPDATE RetailerRegistration SET status = ? WHERE retailerId = ?`;
    db.query(updateStatusQuery, [status, req.params.retailerId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error' });
        }
        return res.status(200).json({ message: 'Retailer status updated successfully' });
    });
};



const getRetailerOrders = async (req, res) => {
    const retailerId = req.retailerId;
    const query = `
        SELECT DISTINCT
            o.order_id, 
            o.user_id, 
            CAST(o.total_amount AS DECIMAL(10,2)) AS total_amount, 
            o.order_status, 
            o.payment_status, 
            o.created_at,
            GROUP_CONCAT(DISTINCT p.productName ORDER BY p.productName SEPARATOR ', ') AS productName,
            SUM(oi.quantity) AS quantity,
            u.first_name, 
            u.last_name, 
            u.email,
            a.address_line, 
            a.city, 
            a.state, 
            a.zip_code, 
            a.phone,
            ot.status AS tracking_status, 
            ot.notes AS tracking_notes
        FROM 
            orders o
            INNER JOIN order_items oi ON o.order_id = oi.order_id
            INNER JOIN product p ON oi.product_id = p.productId
            INNER JOIN users u ON o.user_id = u.user_id
            INNER JOIN addresses a ON o.address_id = a.address_id
            LEFT JOIN (
                SELECT 
                    order_id, 
                    status, 
                    notes,
                    ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY update_time DESC) as rn
                FROM 
                    order_tracking
            ) ot ON o.order_id = ot.order_id AND ot.rn = 1
        WHERE 
            p.retailerId = ?
        GROUP BY 
            o.order_id, 
            o.user_id, 
            o.total_amount, 
            o.order_status, 
            o.payment_status, 
            o.created_at,
            u.first_name, 
            u.last_name, 
            u.email,
            a.address_line, 
            a.city, 
            a.state, 
            a.zip_code, 
            a.phone,
            ot.status, 
            ot.notes
        ORDER BY 
            o.created_at DESC
    `;
    db.query(query, [retailerId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        // Log results to check for duplicates
        // console.log('Fetched orders:', JSON.stringify(results, null, 2));
        // Check for duplicate order_id in results
        const orderIds = results.map((order) => order.order_id);
        const duplicates = orderIds.filter((id, index) => orderIds.indexOf(id) !== index);
        if (duplicates.length > 0) {
            console.warn('Duplicate order IDs in backend response:', duplicates);
        }
        return res.status(200).json({ message: 'Orders fetched successfully', orders: results });
    });
};

const updateOrderStatus = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const retailerId = req.retailerId;

    // console.log('Updating order status for orderId:', orderId, 'to status:', status);

    if (!status) {
        return res.status(400).json({ message: 'Order status is required' });
    }

    try {
        const orderQuery = `
            SELECT o.order_id, o.order_status
            FROM orders o
            INNER JOIN order_items oi ON o.order_id = oi.order_id
            INNER JOIN product p ON oi.product_id = p.productId
            WHERE o.order_id = ? AND p.retailerId = ?
        `;
        db.query(orderQuery, [orderId, retailerId], (err, results) => {
            if (err) {
                console.error('Database error (order check):', err);
                return res.status(500).json({ message: 'Database error', error: err.message });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'Order not found or not associated with this retailer' });
            }

            const order = results[0];
            if (order.order_status === 'Cancelled') {
                return res.status(403).json({ message: 'Cannot modify status for canceled orders' });
            }

            const updateQuery = `
                UPDATE orders
                SET order_status = ?, updated_at = NOW()
                WHERE order_id = ?
            `;
            db.query(updateQuery, [status, orderId], (err) => {
                if (err) {
                    console.error('Database error (status update):', err);
                    return res.status(500).json({ message: 'Database error', error: err.message });
                }

                return res.status(200).json({ message: 'Order status updated successfully' });
            });
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateOrderTracking = async (req, res) => {
    const { orderId } = req.params;
    const { status, notes } = req.body;
    const retailerId = req.retailerId;

    // console.log('Updating tracking for orderId:', orderId, 'with status:', status, 'notes:', notes);

    if (!status) {
        return res.status(400).json({ message: 'Tracking status is required' });
    }

    try {
        const orderQuery = `
            SELECT o.order_id, o.order_status
            FROM orders o
            INNER JOIN order_items oi ON o.order_id = oi.order_id
            INNER JOIN product p ON oi.product_id = p.productId
            WHERE o.order_id = ? AND p.retailerId = ?
        `;
        db.query(orderQuery, [orderId, retailerId], (err, results) => {
            if (err) {
                console.error('Database error (order check):', err);
                return res.status(500).json({ message: 'Database error', error: err.message });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'Order not found or not associated with this retailer' });
            }

            const order = results[0];
            if (order.order_status === 'Cancelled') {
                return res.status(403).json({ message: 'Cannot modify tracking for canceled orders' });
            }

            const trackingQuery = `
                INSERT INTO order_tracking (tracking_id, order_id, status, notes, update_time)
                VALUES (UUID(), ?, ?, ?, NOW())
                ON DUPLICATE KEY UPDATE
                    status = VALUES(status),
                    notes = VALUES(notes),
                    update_time = NOW()
            `;
            db.query(trackingQuery, [orderId, status, notes || ''], (err) => {
                if (err) {
                    console.error('Database error (tracking update):', err);
                    return res.status(500).json({ message: 'Database error', error: err.message });
                }

                return res.status(200).json({ message: 'Tracking updated successfully' });
            });
        });
    } catch (error) {
        console.error('Error updating tracking:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};



const GetCustomersController = async (req, res) => {
  try {
    const retailerId = req.user.retailerId;
    if (!retailerId) {
      return res.status(401).json({ success: false, error: 'Retailer not authenticated' });
    }

    const query = `
      SELECT u.user_id, u.first_name, u.last_name, u.email, u.phone, u.created_at,
        a.address_id, a.address_line, a.city, a.zip_code, a.state, a.country, a.is_default,
        COUNT(DISTINCT o.order_id) as order_count
      FROM users u
      INNER JOIN orders o ON u.user_id = o.user_id
      INNER JOIN addresses a ON o.address_id = a.address_id
      INNER JOIN order_items oi ON o.order_id = oi.order_id
      INNER JOIN product p ON oi.product_id = p.productId
      WHERE p.retailerId = ?
      GROUP BY u.user_id, a.address_id, u.first_name, u.last_name, u.email, u.phone, u.created_at,
        a.address_line, a.city, a.zip_code, a.state, a.country, a.is_default
    `;

    db.query(query, [retailerId], (err, results) => {
      if (err) {
        console.error('Error fetching users:', err);
        return res.status(500).json({ success: false, error: 'Server error', details: err.message });
      }

      // Aggregate addresses by user_id
      const customersMap = new Map();
      results.forEach(row => {
        const customer = customersMap.get(row.user_id) || {
          userId: row.user_id,
          firstName: row.first_name,
          lastName: row.last_name || '',
          email: row.email,
          phone: row.phone || 'N/A',
          createdAt: row.created_at,
          orderCount: row.order_count,
          addresses: []
        };
        customer.addresses.push({
          addressId: row.address_id,
          street: row.address_line || 'N/A',
          city: row.city || 'N/A',
          zipCode: row.zip_code || 'N/A',
          state: row.state || 'N/A',
          country: row.country || 'N/A',
          isDefault: !!row.is_default
        });
        customersMap.set(row.user_id, customer);
      });

      const customers = Array.from(customersMap.values());

      return res.json({
        success: true,
        data: customers,
      });
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message,
    });
  }
};


const GetDashboardDataController = async (req, res) => {
  try {
    const retailerId = req.user.retailerId;
    if (!retailerId) {
      return res.status(401).json({ success: false, error: 'Retailer not authenticated' });
    }

    // Query for stats
    const statsQuery = `
      SELECT 
        COALESCE(SUM(o.total_amount), 0) as totalRevenue,
        COUNT(DISTINCT o.order_id) as totalOrders,
        (SELECT COUNT(*) FROM product p WHERE p.retailerId = ?) as totalProducts,
        (SELECT COUNT(DISTINCT u.user_id) 
         FROM users u
         INNER JOIN orders o ON u.user_id = o.user_id
         INNER JOIN order_items oi ON o.order_id = oi.order_id
         INNER JOIN product p ON oi.product_id = p.productId
         WHERE p.retailerId = ?) as totalCustomers
      FROM orders o
      INNER JOIN order_items oi ON o.order_id = oi.order_id
      INNER JOIN product p ON oi.product_id = p.productId
      WHERE p.retailerId = ?;
    `;

    // Query for products (recent 4 products)
    const productsQuery = `
      SELECT 
        p.productId as id,
        p.productName as name,
        p.quantity as stock,
        COALESCE(SUM(oi.quantity), 0) as sales,
        p.price
      FROM product p
      LEFT JOIN order_items oi ON p.productId = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.order_id
      WHERE p.retailerId = ?
      GROUP BY p.productId, p.productName, p.quantity, p.price
      ORDER BY p.addedAt DESC
      LIMIT 4;
    `;

    // Query for sales overview (last 7 days)
    const salesOverviewQuery = `
      SELECT 
        DATE(o.created_at) as saleDate,
        COALESCE(SUM(o.total_amount), 0) as dailyRevenue
      FROM orders o
      INNER JOIN order_items oi ON o.order_id = oi.order_id
      INNER JOIN product p ON oi.product_id = p.productId
      WHERE p.retailerId = ?
        AND o.created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(o.created_at)
      ORDER BY saleDate ASC;
    `;

    // Query for top selling products (top 3 by quantity sold)
    const topSellingQuery = `
      SELECT 
        p.productId as id,
        p.productName as name,
        COALESCE(SUM(oi.quantity), 0) as sales,
        p.price
      FROM product p
      LEFT JOIN order_items oi ON p.productId = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.order_id
      WHERE p.retailerId = ?
      GROUP BY p.productId, p.productName, p.price
      ORDER BY sales DESC
      LIMIT 3;
    `;

    // Execute queries
    const [statsResults] = await db.promise().query(statsQuery, [retailerId, retailerId, retailerId]);
    const [productsResults] = await db.promise().query(productsQuery, [retailerId]);
    const [salesOverviewResults] = await db.promise().query(salesOverviewQuery, [retailerId]);
    const [topSellingResults] = await db.promise().query(topSellingQuery, [retailerId]);

    // Process stats
    const stats = [
      {
        title: 'Total Revenue',
        value: `₹${parseFloat(statsResults[0].totalRevenue || 0).toFixed(2)}`,
        change: statsResults[0].totalRevenue > 0 ? '+12%' : '0%',
      },
      {
        title: 'Total Orders',
        value: statsResults[0].totalOrders.toString(),
        change: statsResults[0].totalOrders > 0 ? '+8%' : '0%',
      },
      {
        title: 'Products',
        value: statsResults[0].totalProducts.toString(),
        change: statsResults[0].totalProducts > 0 ? '+5%' : '0%',
      },
      {
        title: 'Customers',
        value: statsResults[0].totalCustomers.toString(),
        change: statsResults[0].totalCustomers > 0 ? '+18%' : '0%',
      },
    ];

    // Process sales overview (fill 7 days)
    const today = new Date();
    const salesOverview = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
      const record = salesOverviewResults.find((r) => r.saleDate === dateStr);
      return {
        date: dateStr,
        day: dayLabel,
        revenue: record ? parseFloat(record.dailyRevenue) : 0,
      };
    }).reverse();

    // Normalize sales overview for graph (scale to 100%)
    const maxRevenue = Math.max(...salesOverview.map((s) => s.revenue), 1); // Avoid division by 0
    const salesOverviewHeights = salesOverview.map((s) => (s.revenue / maxRevenue) * 100);

    return res.json({
      success: true,
      data: {
        stats,
        products: productsResults,
        salesOverview, // Raw data with date, day, and revenue
        salesOverviewHeights, // Normalized heights for fallback
        topSelling: topSellingResults,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message,
    });
  }
};


const GetOrdersController = async (req, res) => {
  try {
    const retailerId = req.user.retailerId;
    const { userId } = req.params;

    if (!retailerId) {
      return res.status(401).json({ success: false, error: 'Retailer not authenticated' });
    }

    const query = `
      SELECT 
        o.order_id AS orderId,
        o.user_id AS userId,
        o.created_at AS orderDate,
        o.total_amount AS total,
        o.order_status AS status,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'productId', oi.product_id,
            'productName', p.productName,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) AS items
      FROM orders o
      INNER JOIN order_items oi ON o.order_id = oi.order_id
      INNER JOIN product p ON oi.product_id = p.productId
      WHERE o.user_id = ? AND p.retailerId = ?
      GROUP BY o.order_id, o.user_id, o.created_at, o.total_amount, o.order_status;
    `;

    const [results] = await db.promise().query(query, [userId, retailerId]);
    // console.log('Query results:', JSON.stringify(results, null, 2)); 

    return res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('Error fetching orders:', {
      message: error.message,
      stack: error.stack,
    });
    return res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message,
    });
  }
};



const verifyRetailer = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
//   console.log('Token received:', token);
  if (!token) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('Decoded token:', decoded);
    if (decoded.role !== 'retailer') {
      console.log('Role check failed:', decoded.role);
      return res.status(403).json({ success: false, error: 'Not authorized as retailer' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
};


const safeParseJSON = (value) => {
  if (!value) return [];
  try {
    // If it's already a valid JSON array, parse and return it
    const parsed = JSON.parse(value);
    // Ensure it's an array; if it's a single string, wrap it in an array
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (error) {
    // If parsing fails, assume it's a single URL and wrap it in an array
    return [value];
  }
};

// New controller to fetch all products for a retailer
const GetRetailerInventoryController = async (req, res) => {
  try {
    const retailerId = req.user.retailerId;
    if (!retailerId) {
      return res.status(401).json({ success: false, error: 'Retailer not authenticated' });
    }

    const query = `
      SELECT 
        p.productId,
        p.productName,
        p.description,
        p.category,
        p.subcategory,
        p.brand,
        p.quantity,
        p.price,
        p.images AS productImages,
        p.videoUrl,
        p.addedAt,
        p.updatedAt,
        pd.descriptionId,
        pd.colors,
        pd.sizes,
        pd.weight,
        pd.dimensions,
        pd.materials,
        pd.features,
        pd.images AS descriptionImages,
        pd.videos
      FROM product p
      LEFT JOIN product_descriptions pd ON p.productId = pd.productId
      WHERE p.retailerId = ?
      ORDER BY p.addedAt DESC
    `;

    db.query(query, [retailerId], (err, results) => {
      if (err) {
        console.error('Error fetching inventory:', err);
        return res.status(500).json({ success: false, error: 'Database error', details: err.message });
      }

      // Process results to parse JSON fields
      const products = results.map(product => ({
        productId: product.productId,
        productName: product.productName,
        description: product.description || '',
        category: product.category,
        subcategory: product.subcategory,
        brand: product.brand || '',
        quantity: product.quantity,
        price: parseFloat(product.price).toFixed(2),
        productImages: safeParseJSON(product.productImages),
        videoUrl: product.videoUrl || '',
        addedAt: product.addedAt,
        updatedAt: product.updatedAt,
        descriptionDetails: product.descriptionId ? {
          descriptionId: product.descriptionId,
          colors: safeParseJSON(product.colors),
          sizes: safeParseJSON(product.sizes),
          weight: product.weight ? parseFloat(product.weight).toFixed(2) : null,
          dimensions: product.dimensions || '',
          materials: safeParseJSON(product.materials),
          features: safeParseJSON(product.features),
          images: safeParseJSON(product.descriptionImages),
          videos: safeParseJSON(product.videos)
        } : null
      }));

      return res.json({
        success: true,
        data: products
      });
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message
    });
  }
};

module.exports = { RetailerRegistationController, RetailerLoginController, RetailerLogoutController, RetailerUpdateController, RetailerUpdatePasswordController, 
    RetailerDeleteController, getRetailerDetails, RetailerUpdateStatusController, getRetailerOrders, updateOrderStatus, updateOrderTracking, GetCustomersController,
    verifyRetailer, GetDashboardDataController, GetOrdersController, GetRetailerInventoryController };


















































// const db = require('../../Models/db');
// const bcrypt = require('bcrypt'); 
// const jwt = require('jsonwebtoken');
// const env = require('dotenv');
// env.config();


// const RetailerRegistationController = async (req, res) => {
//     const { Retailer_Name, email, password } = req.body;

//     try {
//         const checkUserQuery = `SELECT * FROM RetailerRegistration WHERE email = ?`;
//         db.query(checkUserQuery, [email], async (err, results) => {
//             if (err) {
//                 return res.status(500).json({ message: 'Database error' });
//             }

//             if (results.length > 0) {
//                 return res.status(400).json({ message: 'User already exists' });
//             }

//             const saltRounds = 10;
//             const hashedPassword = await bcrypt.hash(password, saltRounds);

//             const insertUserQuery = `INSERT INTO RetailerRegistration (retailerId, Retailer_Name, email, password) VALUES (UUID(), ?, ?, ?)`;
//             db.query(insertUserQuery, [Retailer_Name, email, hashedPassword], (err, result) => {
//                 if (err) {
//                     return res.status(500).json({ message: 'Error in retailer registration' });
//                 }
//                 return res.status(201).json({ message: 'User registered successfully', result });
//             });
//         });
//     } catch (error) {
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// };
    

// const RetailerLoginController = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         const checkUserQuery = `SELECT * FROM RetailerRegistration WHERE email = ?`;
//         db.query(checkUserQuery, [email], async (err, results) => {
//             if (err) {
//                 return res.status(500).json({ message: 'Database error' });
//             }

//             if (results.length === 0) {
//                 return res.status(400).json({ message: 'User not found' });
//             }

//             const user = results[0];
//             const isPasswordValid = await bcrypt.compare(password, user.password);

//             if (!isPasswordValid) {
//                 return res.status(400).json({ message: 'Invalid credentials' });
//             }

//             const updateStatusQuery = `UPDATE RetailerRegistration SET status = 'Active' WHERE retailerId = ?`;
//             db.query(updateStatusQuery, [user.retailerId], (err, result) => {
//                 if (err) {
//                     return res.status(500).json({ message: 'Error updating status' });
//                 }

//                 const token = jwt.sign({ retailerId: user.retailerId }, process.env.JWT_SECRET, { expiresIn: '1h' });

//                 return res.status(200).json({ message: 'Login successful', token, retailer: {retailerId: user.retailerId, Retailer_Name: user.Retailer_Name, email: user.email, },});
//             });
//         });
//     } catch (error) {
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// };


// const RetailerLogoutController = async (req, res) => {
//     const { retailerId } = req.body;

//     if (!retailerId) {
//         return res.status(400).json({ message: 'Retailer ID is required' });
//     }

//     try {
//         const updateStatusQuery = `UPDATE RetailerRegistration SET status = 'Inactive' WHERE retailerId = ?`;
        
//         db.query(updateStatusQuery, [retailerId], (err, result) => {
//             if (err) {
//                 console.error('Error updating status:', err);
//                 return res.status(500).json({ message: 'Error updating status' });
//             }

//             if (result.affectedRows === 0) {
//                 return res.status(404).json({ message: 'Retailer not found' });
//             }

//             return res.status(200).json({ message: 'Logout successful' });
//         });
//     } catch (error) {
//         console.error('Internal server error:', error);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// };


// const RetailerUpdateController = async (req, res) => {
//     const { Retailer_Name, email, password } = req.body;

//     try {
//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(password, saltRounds);

//         const updateUserQuery = `UPDATE RetailerRegistration SET Retailer_Name = ?, email = ?, password = ? WHERE retailerId = ?`;
//         db.query(updateUserQuery, [ Retailer_Name, email, hashedPassword, req.params.retailerId ], (err, result) => {
//             if (err) {
//                 return res.status(500).json({ message: 'Database error' });
//             }
//             return res.status(200).json({ message: 'User updated successfully' });
//         });
//     } catch (error) {
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// };


// const RetailerUpdatePasswordController = async (req, res) => {
//     const { password } = req.body;

//     try {
//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(password, saltRounds);

//         const updatePasswordQuery = `UPDATE RetailerRegistration SET password = ? WHERE retailerId = ?`;
//         db.query(updatePasswordQuery, [hashedPassword, req.params.retailerId], (err, result) => {
//             if (err) {
//                 return res.status(500).json({ message: 'Database error' });
//             }
//             return res.status(200).json({ message: 'Password updated successfully' });
//         });
//     } catch (error) {
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// };


// const RetailerDeleteController = async (req, res) => {
//     const deleteUserQuery = `DELETE FROM RetailerRegistration WHERE retailerId = ?`;
//     db.query(deleteUserQuery, [req.params.retailerId], (err, result) => {
//         if (err) {
//             return res.status(500).json({ message: 'Database error' });
//         }
//         return res.status(200).json({ message: 'User deleted successfully' });
//     });
// };


// const getRetailerDetails = async (req, res) => {
//     const getRetailerQuery = `SELECT retailerId, Retailer_Name, email, status, Registered_at FROM RetailerRegistration WHERE retailerId = ?`;
//     db.query(getRetailerQuery, [req.params.retailerId], (err, result) => {
//         if (err) {
//             return res.status(500).json({ message: 'Database error' });
//         }
//         return res.status(200).json({ message: 'Retailer details', result });
//     });
// };


// const RetailerUpdateStatusController = async (req, res) => {
//     const { status } = req.body;

//     const updateStatusQuery = `UPDATE RetailerRegistration SET status = ? WHERE retailerId = ?`;
//     db.query(updateStatusQuery, [status, req.params.retailerId], (err, result) => {
//         if (err) {
//             return res.status(500).json({ message: 'Database error' });
//         }
//         return res.status(200).json({ message: 'Retailer status updated successfully' });
//     });
// };

// module.exports = { RetailerRegistationController, RetailerLoginController, RetailerLogoutController, RetailerUpdateController, RetailerUpdatePasswordController, RetailerDeleteController, getRetailerDetails, RetailerUpdateStatusController };