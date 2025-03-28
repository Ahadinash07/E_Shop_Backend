const app = require("./adminBackend/app");
const env = require('dotenv');
// const cors = require('cors');
// app.use(cors());

env.config();

const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));