const express = require('express');
const env = require('dotenv');
const cors = require('cors');
const adminUserRegistrationRoute = require('./Routes/adminUserRegistrationRoute/adminUserRegistrationRoute');
const AdminRoleRoute = require('./Routes/AdminRoleRoute/AdminRoleRoute');
const AdminRoleAssignRoute = require('./Routes/AdminRoleAssignRoute/AdminRoleAssignRoute');
const AdminUserProfileRoute = require('./Routes/AdminUserProfileRoutes/AdminUserProfileRoute');
const CategoryRoute = require('./Routes/CategoryRoutes/CategoryRoutes');
const SubCategoryRoute = require('./Routes/SubCategoryRoutes/SubCategoryRoutes');
const RetailerregisterRoute = require('./Routes/RetailerRegistationRoute/RetailerRegistationRoute');
const RetailerProfileRoute = require('./Routes/RetailerProfileRoute/RetailerProfileRoute');
const ProductRoute = require('./Routes/ProductRoute/ProductRoute');
const ProductDescriptionRoute = require('./Routes/ProductDescriptionRoute/ProductDescriptionRoute');


const app = express();
env.config();
app.use(cors());
app.use(express.json());

const PORT = process.env.SERVER_PORT;

app.use('/', adminUserRegistrationRoute);

app.use('/', AdminRoleRoute);

app.use('/', AdminRoleAssignRoute);

app.use('/', AdminUserProfileRoute);

app.use('/', CategoryRoute);

app.use('/', SubCategoryRoute);

app.use('/', RetailerregisterRoute);

app.use('/', RetailerProfileRoute);

app.use('/', ProductRoute);

app.use('/', ProductDescriptionRoute);

if (require.main === module) {
    app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
};


module.exports = app;