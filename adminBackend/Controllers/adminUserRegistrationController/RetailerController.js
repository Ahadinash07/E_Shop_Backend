const db = require('../../Models/db');

// Get all retailers
const GetAllRetailers = (req, res) => {
    const sqlQuery = `SELECT * FROM RetailerRegistration`;
    db.query(sqlQuery, (err, result) => {
        if (err) {
            res.status(400).json({ message: "Error Occurred", error: err });
        } else {
            res.status(200).json({ data: result });
        }
    });
}

// Get retailer by ID
const GetRetailerById = (req, res) => { 
    const id = req.params.retailerId;
    const sqlQuery = `SELECT * FROM RetailerRegistration WHERE retailerId = ?`;
    db.query(sqlQuery, id, (err, result) => {
        if (err) {
            res.json({ message: "Error Occurred", error: err });
        } else {
            res.json({ data: result[0] });
        }
    });
}

// Get all products for a specific retailer
const GetRetailerProducts = (req, res) => {
    const retailerId = req.params.retailerId;
    const sqlQuery = `
        SELECT p.*, pd.colors, pd.sizes, pd.weight, pd.dimensions, pd.materials, pd.features
        FROM product p
        LEFT JOIN product_descriptions pd ON p.productId = pd.productId
        WHERE p.retailerId = ?
    `;
    db.query(sqlQuery, retailerId, (err, result) => {
        if (err) {
            res.status(400).json({ message: "Error Occurred", error: err });
        } else {
            res.status(200).json({ data: result });
        }
    });
}

// Get all orders for a specific retailer
const GetRetailerOrders = (req, res) => {
    const retailerId = req.params.retailerId;
    const sqlQuery = `
        SELECT o.*, u.first_name, u.last_name, u.email, u.phone,
               a.address_line, a.city, a.state, a.country, a.zip_code,
               GROUP_CONCAT(oi.product_id) AS product_ids,
               GROUP_CONCAT(oi.quantity) AS quantities,
               GROUP_CONCAT(oi.price) AS prices
        FROM orders o
        JOIN users u ON o.user_id = u.user_id
        JOIN addresses a ON o.address_id = a.address_id
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN product p ON oi.product_id = p.productId
        WHERE p.retailerId = ?
        GROUP BY o.order_id
    `;
    db.query(sqlQuery, retailerId, (err, result) => {
        if (err) {
            res.status(400).json({ message: "Error Occurred", error: err });
        } else {
            // Process the result to format products data
            const formattedResult = result.map(order => {
                const productIds = order.product_ids.split(',');
                const quantities = order.quantities.split(',');
                const prices = order.prices.split(',');
                
                const products = productIds.map((id, index) => ({
                    product_id: id,
                    quantity: quantities[index],
                    price: prices[index]
                }));
                
                return {
                    ...order,
                    products,
                    product_ids: undefined,
                    quantities: undefined,
                    prices: undefined
                };
            });
            
            res.status(200).json({ data: formattedResult });
        }
    });
}

// Update retailer status
const UpdateRetailerStatus = (req, res) => {
    const id = req.params.retailerId;
    const { status } = req.body;
    const sqlQuery = `UPDATE RetailerRegistration SET status = ? WHERE retailerId = ?`;
    db.query(sqlQuery, [status, id], (err, result) => {
        if (err) {
            res.status(400).json({ message: "Error Occurred", error: err });
        } else {
            res.status(200).json({ message: "Retailer Status Updated Successfully" });
        }
    });
}

// Update order tracking
const UpdateOrderTracking = (req, res) => {
    const orderId = req.params.orderId;
    const { status, notes } = req.body;
    
    const sqlQuery = `
        INSERT INTO order_tracking (order_id, status, notes)
        VALUES (?, ?, ?)
    `;
    
    db.query(sqlQuery, [orderId, status, notes], (err, result) => {
        if (err) {
            res.status(400).json({ message: "Error Occurred", error: err });
        } else {
            // Also update the order status in the orders table
            const updateOrderQuery = `UPDATE orders SET order_status = ? WHERE order_id = ?`;
            db.query(updateOrderQuery, [status, orderId], (err, updateResult) => {
                if (err) {
                    res.status(400).json({ message: "Error updating order status", error: err });
                } else {
                    res.status(200).json({ message: "Order Tracking Updated Successfully" });
                }
            });
        }
    });
}

// Get order tracking history
const GetOrderTracking = (req, res) => {
    const orderId = req.params.orderId;
    const sqlQuery = `SELECT * FROM order_tracking WHERE order_id = ? ORDER BY update_time DESC`;
    db.query(sqlQuery, orderId, (err, result) => {
        if (err) {
            res.status(400).json({ message: "Error Occurred", error: err });
        } else {
            res.status(200).json({ data: result });
        }
    });
}

module.exports = { 
    GetAllRetailers, 
    GetRetailerById, 
    GetRetailerProducts, 
    GetRetailerOrders,
    UpdateRetailerStatus,
    UpdateOrderTracking,
    GetOrderTracking
};