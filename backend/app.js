const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const receiptRoutes = require('./routes/receiptRoutes');

const app = express();

mongoose.connect('mongodb+srv://admin:v58sHwdzlknkv6Py@cluster0.safetik.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/receipts', receiptRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//Parse XML to JSON in the project
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});
