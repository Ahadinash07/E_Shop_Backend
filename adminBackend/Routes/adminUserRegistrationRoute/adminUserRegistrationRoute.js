const express = require('express');
const { adminUserRegistration, adminUserLogin, adminUserUpdate, updateUserPassword, getAdminUser, getAdminUserById, deleteAdminUser, adminUserLogout, updateUserAdminStatus } = require('../../Controllers/adminUserRegistrationController/adminUserRegistrationController');
const { adminUserRegistrationValidation, adminUserLoginValidation, adminUserLogoutValidation, adminUserUpdateValidation, adminUserUpdatePasswordValidation, updateUserAdminStatusValidation } = require('../../Controllers/adminUserRegistrationController/adminUserRegistrationValidation');

const adminUserRegistrationRoute = express.Router();

adminUserRegistrationRoute.post('/admin_user_registration', adminUserRegistrationValidation, adminUserRegistration);

adminUserRegistrationRoute.post('/admin_user_login', adminUserLoginValidation, adminUserLogin);

adminUserRegistrationRoute.post('/admin_user_logout', adminUserLogoutValidation, adminUserLogout);

adminUserRegistrationRoute.put('/admin_user_update', adminUserUpdateValidation, adminUserUpdate);

// adminUserRegistrationRoute.put('/admin_user_update/:userId', adminUserUpdate);

adminUserRegistrationRoute.patch('/admin_user_update_password', adminUserUpdatePasswordValidation, updateUserPassword);

adminUserRegistrationRoute.post('/get_admin_user', getAdminUser);

adminUserRegistrationRoute.post('/update_admin_user_status', updateUserAdminStatusValidation, updateUserAdminStatus);

adminUserRegistrationRoute.get('/get_user/:userId', getAdminUserById);

adminUserRegistrationRoute.delete('/delete_user/:userId', deleteAdminUser);

module.exports = adminUserRegistrationRoute;