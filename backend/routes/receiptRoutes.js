const express = require('express');
const router = express.Router();
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const Receipt = require('../models/Receipt');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/png', 'image/jpeg'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type! Please upload any of these type pdf, png, jpeg.'), false);
  }
});

router.post(
  '/submit',
  upload.single('receipt'),
  [
    body('date').isISO8601().toDate(),
    body('amount').isFloat({ gt: 0 }),
    body('description').notEmpty().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { date, amount, description } = req.body;
    const receiptFile = req.file?.filename;

    if (!receiptFile) return res.status(400).json({ error: 'Receipt is required!' });

    const newReceipt = new Receipt({ date, amount, description, receiptFile });
    await newReceipt.save();

    res.status(201).json({ message: 'successful!' });
  }
);

module.exports = router;
