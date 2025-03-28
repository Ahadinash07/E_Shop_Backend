const db = require("../../Models/db");

const AddRetailerProfileDetailsController = async (req, res) => {
    const {retailerId, businessName, age, DoB, phoneNo, alternateContact, businessAddress, state, city, businessType, GSTNo, PANNo, AadharNo, businessLogo } = req.body;
    const sqlQuery = 'INSERT INTO RetailerProfile (retailerId, businessName, age, DoB, phoneNo, alternateContact, businessAddress, state, city, businessType, GSTNo, PANNo, AadharNo, businessLogo) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    db.query(sqlQuery, [retailerId, businessName, age, DoB, phoneNo, alternateContact, businessAddress, state, city, businessType, GSTNo, PANNo, AadharNo, businessLogo], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
        return res.status(201).json({ message: 'Retailer profile details added successfully', result });
    }
    );
};

const getRetailerProfileDetails = async (req, res) => {
    const { retailerId } = req.params;
    const sqlQuery = 'SELECT * FROM RetailerProfile WHERE retailerId = ?';
    db.query(sqlQuery, [retailerId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
        return res.status(200).json({ message: 'Retailer profile details fetched successfully', result });
    });
};

const getRetailerDetailsById = async (req, res) => {
    const { retailerId } = req.params;
    const sqlQuery = 'SELECT * FROM RetailerProfile WHERE retailerId = ?';
    db.query(sqlQuery, [retailerId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
        return res.status(200).json({ message: 'Retailer profile details fetched successfully', result });
    });
}

const updateRetailerProfileDetails = async (req, res) => {
    const { retailerId, businessName, age, DoB, phoneNo, alternateContact, businessAddress, state, city, businessType, GSTNo, PANNo, AadharNo, businessLogo } = req.body;
    const sqlQuery = 'UPDATE RetailerProfile SET businessName = ?, age = ?, DoB = ?, phoneNo = ?, alternateContact = ?, businessAddress = ?, state = ?, city = ?, businessType = ?, GSTNo = ?, PANNo = ?, AadharNo = ?, businessLogo = ? WHERE retailerId = ?';
    db.query(sqlQuery, [businessName, age, DoB, phoneNo, alternateContact, businessAddress, state, city, businessType, GSTNo, PANNo, AadharNo, businessLogo, retailerId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error' });
        }
        return res.status(200).json({ message: 'Retailer profile details updated successfully', result });
    });
}


module.exports = { AddRetailerProfileDetailsController, getRetailerProfileDetails, getRetailerDetailsById, updateRetailerProfileDetails }; 

