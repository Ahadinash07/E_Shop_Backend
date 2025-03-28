const db = require("../../Models/db");


// ===========================Assign==========================Admin=============================Role==============================

// const addRoleAssign = (req, res) => {
//     const { roleId, userId } = req.body;
//     // const data = req.body;
//     // const sqlQuery = 'INSERT INTO AdminRoleAssign SET ?';
//     // const sqlQuery = 'INSERT INTO AdminRoleAssign SET roleId = ?, userId = ?';
    
//     const sqlQuery = 'SELECT addAdminRoleAssign(?, ?)';                         // STORED FUNCTION

//     db.query(sqlQuery, [roleId, userId], (err, result) => {
//         // db.query(sqlQuery, [data], (err, result) => {
//         if(err){
//             return res.json({error: err});
//         }
//         else{
//             if(result[0].status === 1){
//                 return res.json('Failed to assigned Role');
//             }
//             else{
//                 return res.json(result);
//             }
//         }
//     });
// }


// ===========================Get==========================Admin=============================Role==============================

const getRoleAssignByRoleID = (req, res) => {

    // const sqlQuery = 'SELECT * FROM AdminRoleAssign WHERE roleId = ?';

    const sqlQuery = 'SELECT getAdminRoleAssign(?)';                            // STORED FUNCTION

    db.query(sqlQuery, req.params.roleId, (err, result) => {
        if(err){
            return res.json({error: err});
        }
        else{
            return res.json(result);
        }
    } );
} 


// ===============Add================Admin==============Role=============BY======RoleID=============&=================UserID====

const getRoleAssignByUserId = (req, res) => {

    // const sqlQuery = 'SELECT * FROM AdminRoleAssign WHERE roleId AND userId = ?';

    const sqlQuery = 'CALL GetRoleAssignByUserId(?, ?)';                        // STORED PROCEDURE
    const roleId = req.query.roleId;
    const userId = req.query.userId;
    
    db.query(sqlQuery,[roleId, userId], (err, result) => {
        // console.log(result);
        console.log(roleId, userId)
        if(err){
            return res.json({error: err});
            }
            else{
            return res.json(result[0]);
            }
    } );
}


// ===============Delete================Admin==============Role=============BY======RoleID=============&===============UserID====

const deleteRoleAssign = (req, res) => {

    // const sqlQuery = 'DELETE FROM AdminRoleAssign WHERE roleId = ? AND userId = ?';

    const sqlQuery = 'CALL deleteAdminRoleAssign(?, ?)';                        // STORED PROCEDURE
    const roleId = req.query.roleId;
    const userId = req.query.userId;
    db.query(sqlQuery, [roleId, userId], (err, result) => {
        if(err){
            return res.json({error: err});
        }
        else{
            return res.json(result);
        }
    })
}










const addRoleAssign = (req, res) => {
    const { roleId, userId } = req.body;

    const sqlQuery = 'INSERT INTO AdminRoleAssign SET roleId = ?, userId = ?';
    // const sqlQuery = 'SELECT addAdminRoleAssign(?, ?)';  // stored function

    db.query(sqlQuery, [roleId, userId], (err, result) => {
        if (err) {
            return res.json({ error: err });
        } else {
            if (result[0].status === 1) {
                return res.json('Failed to assign role');
            } else {
                return res.json(result);
            }
        }
    });
}


const addRoleAssign1 = (req, res) => {
    const { userId, role } = req.body;
  
    // Validate the request
    if (!userId || !role) {
      return res.status(400).json({ error: "userId and role are required" });
    }
  
    // Check if the role assignment already exists
    const checkQuery = 'SELECT * FROM AdminRoleAssign WHERE userId = ? AND roleId = ?';
    db.query(checkQuery, [userId, role], (err, results) => {
      if (err) {
        console.error('Error checking role assignment:', err);
        return res.status(500).json({ error: 'Error checking role assignment' });
      }
  
      if (results.length > 0) {
        return res.status(400).json({ error: 'Role already assigned to user' });
      }
  
      // Insert the new role assignment
      const insertQuery = 'INSERT INTO AdminRoleAssign (roleId, userId) VALUES (?, ?)';
      db.query(insertQuery, [role, userId], (err, results) => {
        if (err) {
          console.error('Error assigning role:', err);
          return res.status(500).json({ error: 'Error assigning role' });
        }
        res.json({ success: true });
      });
    });
  };


module.exports = { addRoleAssign, getRoleAssignByRoleID, deleteRoleAssign, getRoleAssignByUserId, addRoleAssign1 }