const db = require("../../Models/db");


// ===========================Add==========================Admin=============================Role==============================

const addAdminRole = (req, res) => {
    const {roleId, roleName} = req.body;
    // const sqlQuery = 'INSERT INTO AdminRole SET roleId = ?, roleName = ?';

    const sqlQuery = 'SELECT addAdminRole(?, ?)';                                       // STORED FUNCTION

    db.query(sqlQuery, [roleId, roleName], (err, result) => {
        if(err){
            return res.json({error: err});
        }
        else{
            return res.json(result);
        }
    });
}
       

// ===========================Get==========================Admin=============================Role==============================

const getAdminRole = (req, res) => {
    const sqlQuery = 'SELECT * FROM AdminRole';

    // const roleId = req.params.roleId;

    // const sqlQuery = 'SELECT getAdminRole(?)';                                          // STORED FUNCTION

    // db.query(sqlQuery, [roleId], (err, result) => {
        db.query(sqlQuery, (err, result) => {
        // console.log(result[0]);
        if(err){
            return res.json({error: err});
        }
        else{
            return res.json(result);
        }
    });
}




const getAdminRoleNameByRoleID = (req, res) => {

    const sqlQuery = 'SELECT roleName FROM AdminRole WHERE roleId = ?';

    const roleId = req.params.roleId;

    db.query(sqlQuery, [roleId], (err, result) => {
        // db.query(sqlQuery, (err, result) => {
        // console.log(result[0]);
        if(err){
            return res.json({error: err});
        }
        else{
            return res.json(result);
        }
    });
}


// ===========================Update==========================Admin=============================Role==============================

const updateAdminRole = (req, res) => {
    // const data = [ req.body.roleName, req.params.roleId ];
    const { roleId, roleName } = req.body;
    
    
    // const sqlQuery = 'UPDATE AdminRole SET roleName = ? WHERE roleId = ?';

    const sqlQuery = 'CALL updateAdminRole(?, ?)';                                      // STORED PROCEDURE

    db.query(sqlQuery, [roleId, roleName], (err, result) => {
        // console.log(roleId, roleName);
        // db.query(sqlQuery, data, (err, result) => {
        if(err){
            return res.json({error: err});
        }
        else{
            return res.json(result);
        }
    });
}


// ===========================Delete==========================Admin=============================Role==============================

const deleteAdminRole = (req, res) => {
    // const sqlQuery = 'DELETE FROM AdminRole WHERE roleId = ?';

    const sqlQuery = 'SELECT deleteAdminRole(?)'                                        // STORED FUNCTION

    db.query(sqlQuery, [req.params.roleId], (err, result) => {
        if(err){
            return res.json({error: err});
        }
        else{
            return res.json(result);
        }
    });
}



const getUserRoles = (req, res) => {
    const userId = req.params.userId;

    const sqlQuery = 'SELECT r.roleName FROM AdminRole r JOIN AdminRoleAssign a ON r.roleId = a.roleId WHERE a.userId = ?';

    db.query(sqlQuery, [userId], (err, result) => {
        if (err) {
            return res.json({ error: err });
        } else {
            return res.json(result);
        }
    });
}



// const getUserRoleName = async (req, res) => {
//     const { roleName } = req.query;

//     if (!roleName) return res.status(400).json({ error: "Role Name is required" });

//     try {
//         const [result] = await db.execute("CALL CheckRoleNameExists(?)", [roleName]);

//         // MySQL stored procedures return data as an array of arrays
//         const rows = result[0]; 

//         res.json({ exists: rows && rows.length > 0 && rows[0].role_exists > 0 });
//     } catch (error) {
//         console.error("Error checking Role Name:", error);
//         res.status(500).json({ error: "Server error" });
//     }
// };

// // Function to check if Role ID exists
// const getUserRoleID = async (req, res) => {
//     const { roleId } = req.query;

//     if (!roleId) return res.status(400).json({ error: "Role ID is required" });

//     try {
//         const [result] = await db.execute("CALL CheckRoleIdExists(?)", [roleId]);

//         // Extract the first row from the result set
//         const rows = result[0];

//         res.json({ exists: rows && rows.length > 0 && rows[0].role_exists > 0 });
//     } catch (error) {
//         console.error("Error checking Role ID:", error);
//         res.status(500).json({ error: "Server error" });
//     }
// };

module.exports = { addAdminRole, getAdminRole, updateAdminRole, deleteAdminRole, getAdminRoleNameByRoleID, getUserRoles,  }