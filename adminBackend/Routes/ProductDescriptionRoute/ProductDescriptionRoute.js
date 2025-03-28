const express = require('express');
const router = express.Router();
const { upload, uploadToS3 } = require('../../middleware/awsmiddleware');
const {
  AddProductDescriptionController,
  GetProductDescriptionController
} = require('../../Controllers/ProductDescriptionController/ProductDescriptionController');

// File upload endpoint
router.post('/uploadMedia', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }

    if (!req.body.productId || !req.body.type) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing productId or type in request body' 
      });
    }

    // Validate file type
    const validTypes = ['image', 'video'];
    if (!validTypes.includes(req.body.type)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid type. Must be "image" or "video"' 
      });
    }

    // Upload to S3
    const url = await uploadToS3(req.file);
    
    return res.json({ 
      success: true,
      url,
      productId: req.body.productId,
      type: req.body.type
    });

  } catch (error) {
    console.error('Upload failed:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'File upload failed',
      details: error.message
    });
  }
});

// Main endpoints
router.post('/productDescriptions', 
  upload.fields([
    { name: 'images', maxCount: 5 },
    { name: 'videos', maxCount: 2 }
  ]),
  AddProductDescriptionController
);

router.get('/productDescriptions/:productId', GetProductDescriptionController);

module.exports = router;