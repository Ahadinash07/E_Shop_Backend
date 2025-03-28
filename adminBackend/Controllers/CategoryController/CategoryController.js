const db = require('../../Models/db');


const GetCategories = (req, res) => {
    const sqlQuery = 'CALL GetAllCategory()';
    // const sqlQuery = 'SELECT * FROM category';
    db.query(sqlQuery, (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
}

const GetCategoriesByCatId = (req, res) => {
    // const sqlQuery = 'SELECT * FROM category WHERE catId = ?';
    const sqlQuery = 'CALL GetCategoryByID(?)';
    const catId = req.params.catId;
    db.query(sqlQuery, catId, (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
}

const AddCategory = (req, res) => {     
    const { catId, catName } = req.body;
    const sqlQuery = 'CALL AddCategory(?)';
    // const sqlQuery = 'INSERT INTO category (catId, catName) VALUES (UUID(),?)'
    db.query(sqlQuery, [catName], (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
}

const UpdateCategory = (req, res) => {
    const { catId, catName } = req.body;
    const sqlQuery = 'UPDATE category SET catName = ? WHERE catId = ?';
    db.query(sqlQuery, [catName, catId], (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
}

const DeleteCategory = (req, res) => {
    const catId = req.params.catId;
    const sqlQuery = 'DELETE FROM category WHERE catId = ?';
    db.query(sqlQuery, catId, (err, result) => {
        if(err) {
            console.log(err);
        } else {
            res.send(result);
        }
    });
}

module.exports = { GetCategories, GetCategoriesByCatId, AddCategory, UpdateCategory, DeleteCategory }