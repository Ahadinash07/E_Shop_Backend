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

                const token = jwt.sign({ retailerId: user.retailerId }, process.env.JWT_SECRET, { expiresIn: '1h' });

                return res.status(200).json({ message: 'Login successful', token, retailer: {retailerId: user.retailerId, Retailer_Name: user.Retailer_Name, email: user.email, },});
            });
        });
    } catch (error) {
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

module.exports = { RetailerRegistationController, RetailerLoginController, RetailerLogoutController, RetailerUpdateController, RetailerUpdatePasswordController, RetailerDeleteController, getRetailerDetails, RetailerUpdateStatusController };