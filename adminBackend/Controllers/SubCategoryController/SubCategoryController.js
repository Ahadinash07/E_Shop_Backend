const db = require('../../Models/db');

const GetSubCategory =(req, res) => {
    const sqlQuery = `SELECT * FROM SubCategory`;
    db.query(sqlQuery, (err, result) => {
        if (err) {
            res.status(400).json({ message: "Error Occurred", error: err });
        } else {
            res.status(200).json({ data: result });
        }
    });
}

const GetSubCategoryById = (req, res) => { 
    const id = req.params.subCatId;
    const sqlQuery = `SELECT * FROM SubCategory WHERE subCatId = ?`;
    db.query(sqlQuery,id, (err, result) => {
        if (err) {
            res.json({ message: "Error Occurred", error: err });
        } else {
            res.json({ data: result });
        }
    });
}

const CreateSubCategory = (req, res) => {
    const { subCatId, subCatName, catId } = req.body;
    const sqlQuery = `INSERT INTO SubCategory (subCatId, subCatName, catId) VALUES (UUID(), ?, ? )`;
    db.query(sqlQuery,[subCatName, catId], (err, result) => {
        if (err) {
            res.status(400).json({ message: "Error Occurred", error: err });
        } else {
            res.status(200).json({ message: "Sub Category Created Successfully" });
        }
    });
}

const UpdateSubCategory = (req, res) => {
    const id = req.params.subCatId;
    const { subCatId, subCatName, catId } = req.body;
    const sqlQuery = `UPDATE SubCategory SET subCatName = ?, catId = ? WHERE subCatId = ?`;
    db.query(sqlQuery, [subCatName, catId, id], (err, result) => {
        if (err) {
            res.status(400).json({ message: "Error Occurred", error: err });
        } else {
            res.status(200).json({ message: "Sub Category Updated Successfully" });
        }
    });
}

const DeleteSubCategory = (req, res) => {
    const id = req.params.subCatId;
    const sqlQuery = `DELETE FROM SubCategory WHERE subCatId = ?`;
    db.query(sqlQuery, id, (err, result) => {
        if (err) {
            res.status(400).json({ message: "Error Occurred", error: err });
        } else {
            res.status(200).json({ message: "Sub Category Deleted Successfully" });
        }
    });
}


module.exports = { GetSubCategory, GetSubCategoryById, CreateSubCategory, UpdateSubCategory, DeleteSubCategory }   