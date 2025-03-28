const express = require('express');
const { addRoleAssign, getRoleAssignByRoleID, deleteRoleAssign, getRoleAssignByUserId, addRoleAssign1 } = require('../../Controllers/AdminRoleAssignController/AdminRoleAssignController');
const { addRoleAssignValidation, getRoleAssignByRoleIDValidation,   } = require('../../Controllers/AdminRoleAssignController/AdminRoleAssignValidation');


const AdminRoleAssignRoute = express.Router();

// AdminRoleAssignRoute.post('/add_admin_role_assign', addRoleAssignValidation, addRoleAssign);

AdminRoleAssignRoute.post('/add_admin_role_assign',  addRoleAssign1);

AdminRoleAssignRoute.get('/get_admin_role_assign/:roleId', getRoleAssignByRoleIDValidation, getRoleAssignByRoleID);

AdminRoleAssignRoute.get('/get_admin_role_assign',  getRoleAssignByUserId);

AdminRoleAssignRoute.delete('/delete_admin_role_assign', deleteRoleAssign);


// AdminRoleAssignRoute.post('/add_admin_role_assign', addRoleAssign);

module.exports = AdminRoleAssignRoute;