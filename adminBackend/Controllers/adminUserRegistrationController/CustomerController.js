const db = require('../../Models/db');

// Get all users
const GetAllUsers = (req, res) => {
    const sqlQuery = `SELECT * FROM users`;
    db.query(sqlQuery, (err, result) => {
        if (err) {
            res.status(400).json({ message: "Error Occurred", error: err });
        } else {
            res.status(200).json({ data: result });
        }
    });
}

// Get user by ID
const GetUserById = (req, res) => { 
    const id = req.params.userId;
    const sqlQuery = `SELECT * FROM users WHERE user_id = ?`;
    db.query(sqlQuery, id, (err, result) => {
        if (err) {
            res.json({ message: "Error Occurred", error: err });
        } else {
            res.json({ data: result[0] });
        }
    });
}

// Get user orders
const GetUserOrders = (req, res) => {
    const userId = req.params.userId;
    const sqlQuery = `
        SELECT o.*, 
               GROUP_CONCAT(oi.product_id) AS product_ids,
               GROUP_CONCAT(oi.quantity) AS quantities,
               GROUP_CONCAT(oi.price) AS prices
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        WHERE o.user_id = ?
        GROUP BY o.order_id
    `;
    db.query(sqlQuery, userId, (err, result) => {
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

// Update user status
const UpdateUserStatus = (req, res) => {
    const id = req.params.userId;
    const { status } = req.body;
    const sqlQuery = `UPDATE users SET status = ? WHERE user_id = ?`;
    db.query(sqlQuery, [status, id], (err, result) => {
        if (err) {
            res.status(400).json({ message: "Error Occurred", error: err });
        } else {
            res.status(200).json({ message: "User Status Updated Successfully" });
        }
    });
}

module.exports = { 
    GetAllUsers, 
    GetUserById, 
    GetUserOrders,
    UpdateUserStatus
};