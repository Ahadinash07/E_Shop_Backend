const db = require('../../Models/db');
const { uploadToS3 } = require('../../middleware/awsmiddleware');


const AddProductDescriptionController = async (req, res) => {
  try {
    if (!req.body.productId) {
      return res.status(400).json({ 
        success: false, 
        error: 'productId is required' 
      });
    }

    const payload = {
      productId: req.body.productId,
      colors: Array.isArray(req.body.colors) ? req.body.colors : [],
      sizes: Array.isArray(req.body.sizes) ? req.body.sizes : [],
      weight: req.body.weight || null,
      dimensions: req.body.dimensions || '',
      materials: Array.isArray(req.body.materials) ? req.body.materials : [],
      features: Array.isArray(req.body.features) ? req.body.features : [],
      images: Array.isArray(req.body.images) ? req.body.images : [],
      videos: Array.isArray(req.body.videos) ? req.body.videos : []
    };

    if (req.files) {
      // Upload images
      if (req.files.images) {
        const imageUploads = await Promise.all(
          req.files.images.map(async (file) => {
            try {
              const url = await uploadToS3(file);
              return url;
            } catch (error) {
              console.error(`Failed to upload image ${file.originalname}:`, error);
              return null;
            }
          })
        );
        payload.images = [...payload.images, ...imageUploads.filter(url => url !== null)];
      }

      // Upload videos
      if (req.files.videos) {
        const videoUploads = await Promise.all(
          req.files.videos.map(async (file) => {
            try {
              const url = await uploadToS3(file);
              return url;
            } catch (error) {
              console.error(`Failed to upload video ${file.originalname}:`, error);
              return null;
            }
          })
        );
        payload.videos = [...payload.videos, ...videoUploads.filter(url => url !== null)];
      }
    }

    // console.log('Payload before DB operation:', payload);

    const checkQuery = `SELECT * FROM product_descriptions WHERE productId = ?`;
    db.query(checkQuery, [payload.productId], async (err, results) => {
      if (err) {
        console.error('Database Error:', err);
        return res.status(500).json({ 
          success: false, 
          error: 'Database error',
          details: err.message 
        });
      }

      if (results.length > 0) {
        // Update existing description
        const updateQuery = `UPDATE product_descriptions SET 
          colors = ?, 
          sizes = ?, 
          weight = ?, 
          dimensions = ?, 
          materials = ?, 
          features = ?, 
          images = ?, 
          videos = ?,
          updatedAt = NOW()
          WHERE productId = ?`;
        
        const updateParams = [
          JSON.stringify(payload.colors),
          JSON.stringify(payload.sizes),
          payload.weight,
          payload.dimensions,
          JSON.stringify(payload.materials),
          JSON.stringify(payload.features),
          JSON.stringify(payload.images),
          JSON.stringify(payload.videos),
          payload.productId
        ];

        db.query(updateQuery, updateParams, (err, result) => {
          if (err) {
            console.error('Update Error:', err);
            return res.status(500).json({ 
              success: false, 
              error: 'Update failed',
              details: err.message,
              query: updateQuery,
              params: updateParams
            });
          }
          
          // console.log('Update result:', result);
          
          return res.json({ 
            success: true, 
            message: 'Description updated successfully',
            data: payload
          });
        });
      } else {
        // Create new description
        const insertQuery = `INSERT INTO product_descriptions 
          (descriptionId, productId, colors, sizes, weight, dimensions, 
           materials, features, images, videos, createdAt, updatedAt)
          VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
        
        const insertParams = [
          payload.productId,
          JSON.stringify(payload.colors),
          JSON.stringify(payload.sizes),
          payload.weight,
          payload.dimensions,
          JSON.stringify(payload.materials),
          JSON.stringify(payload.features),
          JSON.stringify(payload.images),
          JSON.stringify(payload.videos)
        ];

        db.query(insertQuery, insertParams, (err, result) => {
          if (err) {
            console.error('Insert Error:', err);
            return res.status(500).json({ 
              success: false, 
              error: 'Insert failed',
              details: err.message,
              query: insertQuery,
              params: insertParams
            });
          }
          
          // console.log('Insert result:', result);
          
          return res.json({ 
            success: true, 
            message: 'Description created successfully',
            data: payload
          });
        });
      }
    });
  } catch (error) {
    console.error('Controller Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error',
      details: error.message 
    });
  }
};


const GetProductDescriptionController = async (req, res) => {
  const { productId } = req.params;

  try {
    const query = `SELECT * FROM product_descriptions WHERE productId = ?`;
    db.query(query, [productId], (err, results) => {
      if (err) {
        console.error('Database Error:', err);
        return res.status(500).json({ 
          success: false, 
          error: 'Database error',
          details: err.message 
        });
      }
      
      if (results.length === 0) {
        return res.json({ 
          success: true, 
          data: {
            colors: [], 
            sizes: [], 
            weight: null, 
            dimensions: '',
            materials: [], 
            features: [], 
            images: [], 
            videos: []
          }
        });
      }

      // Safely parse JSON fields with fallbacks
      const description = {
        ...results[0],
        colors: tryParseJSON(results[0].colors) || [],
        sizes: tryParseJSON(results[0].sizes) || [],
        materials: tryParseJSON(results[0].materials) || [],
        features: tryParseJSON(results[0].features) || [],
        images: tryParseJSON(results[0].images) || [],
        videos: tryParseJSON(results[0].videos) || []
      };

      return res.json({ 
        success: true, 
        data: description 
      });
    });
  } catch (error) {
    console.error('Controller Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Server error',
      details: error.message 
    });
  }
};

// Helper function to safely parse JSON
function tryParseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return null;
  }
}

module.exports = {
  AddProductDescriptionController,
  GetProductDescriptionController
};