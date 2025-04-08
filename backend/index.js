const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
