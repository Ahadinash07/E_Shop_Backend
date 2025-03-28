const express = require('express');
const { addAdminUserProfileData, updateAdminUserProfileData, getAdminUserProfileData, getAdminUserProfileDataByUserId } = require('../../Controllers/AdminUserProfileController/AdminUserProfileController');
const { addAdminUserProfileValidation, updateAdminUserProfileValidation } = require('../../Controllers/AdminUserProfileController/AdminUserProfileValidation');

const AdminUserProfileRoute = express.Router();


AdminUserProfileRoute.post('/add_admin_user_profile', addAdminUserProfileValidation, addAdminUserProfileData);

AdminUserProfileRoute.put('/update_admin_user_profile/:userId', updateAdminUserProfileValidation, updateAdminUserProfileData);

AdminUserProfileRoute.get('/get_admin_user_profile', getAdminUserProfileData);

AdminUserProfileRoute.get('/get_admin_user_profile/:userId', getAdminUserProfileDataByUserId);

module.exports = AdminUserProfileRoute;