const db = require("../../Models/db");


const addAdminUserProfileData = (req, res) => {
    const data = req.body;
    const sqlQuery = 'INSERT INTO AdminUserProfile SET ?'
    // const { userId, fatherName , age, DoB, PhoneNo, alternateContact, address, state, city, qualification, aadharNo, pancardNo, ProfileImage } = req.body;
    // const sqlQuery = 'INSERT INTO AdminUserProfile (userId, fatherName , age, DoB, PhoneNo, alternateContact, address, state, city, qualification, aadharNo, pancardNo, ProfileImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    // db.query(sqlQuery, [ userId, fatherName , age, DoB, PhoneNo, alternateContact, address, state, city, qualification, aadharNo, pancardNo, ProfileImage ], (err, result) => {
        db.query(sqlQuery, data, (err, result) =>{
        if(err){
            return res.json({error: err});
        }
        else{
            return res.json(result);
        }
    })
}


const updateAdminUserProfileData = (req, res) => {
    const { fatherName , age, DoB, PhoneNo, alternateContact, address, state, city, qualification, aadharNo, pancardNo, ProfileImage } = req.body;
    
    const sqlQuery = 'UPDATE AdminUserProfile SET fatherName = ?, age = ?, DoB = ?, PhoneNo = ?, alternateContact = ?, address = ?, state = ?, city = ?, qualification = ?, aadharNo = ?, pancardNo = ?, ProfileImage = ? WHERE userId = ?';

    db.query(sqlQuery, [ fatherName , age, DoB, PhoneNo, alternateContact, address, state, city, qualification, aadharNo, pancardNo, ProfileImage, req.params.userId ], (err, result) => {
        if(err){
            return res.json({error: err});
        }
        else{
            return res.json(result);
        }
    })
}



const getAdminUserProfileData = (req, res) => {
    const sqlQuery = 'SELECT userId, fatherName , age, DoB, PhoneNo, alternateContact, address, state, city, qualification, aadharNo, pancardNo, ProfileImage FROM AdminUserProfile';
    db.query(sqlQuery, (err, result) => {
        if(err){
            return res.json({error: err});
        }
        else{
            return res.json(result);
        }
    })
}


const getAdminUserProfileDataByUserId = (req, res) => {
    const userId = req.params.userId;
    const sqlQuery = 'SELECT userId, fatherName , age, DoB, PhoneNo, alternateContact, address, state, city, qualification, aadharNo, pancardNo, ProfileImage FROM AdminUserProfile WHERE userId = ?';
    db.query(sqlQuery,[userId], (err, result) => {
        if(err){
            return res.json({error: err});
        }
        else{
            return res.json(result);
        }
    })
}






module.exports = { addAdminUserProfileData, updateAdminUserProfileData, getAdminUserProfileData, getAdminUserProfileDataByUserId }