const db = require('../../Models/db');
const fetch = require('node-fetch');
const { GoogleAuth } = require('google-auth-library');

const GetProductRecommendations = (req, res) => {
  const { query, category, subcategory, brand } = req.query;
  // console.log('Received /api/recommendations request with params:', { query, category, subcategory, brand });

  let sqlQuery = `SELECT productId, productName, category, subcategory, brand, price, images 
                  FROM product 
                  WHERE quantity > 0`;
  const queryParams = [];

  // Map the query to a category (case-insensitive)
  const categoryMap = {
    laptops: 'laptops',
    mobiles: 'mobiles',
    // Add more mappings as needed
  };

  // Normalize the query to lowercase for matching
  const normalizedQuery = query ? query.toLowerCase() : null;

  if (normalizedQuery && categoryMap[normalizedQuery]) {
    // If the query matches a known category, filter by that category
    sqlQuery += ` AND LOWER(category) = ?`;
    queryParams.push(categoryMap[normalizedQuery]);
  } else if (query) {
    // Fallback to searching in productName and description
    sqlQuery += ` AND (productName LIKE ? OR description LIKE ?)`;
    queryParams.push(`%${query}%`, `%${query}%`);
  }

  // Additional filters
  if (category) {
    sqlQuery += ` AND category = ?`;
    queryParams.push(category);
  }
  if (subcategory) {
    sqlQuery += ` AND subcategory = ?`;
    queryParams.push(subcategory);
  }
  if (brand) {
    sqlQuery += ` AND brand = ?`;
    queryParams.push(brand);
  }

  sqlQuery += ` LIMIT 5`;

  // Log the SQL query and parameters for debugging
  // console.log('Executing SQL Query:', sqlQuery);
  // console.log('Query Parameters:', queryParams);

  db.query(sqlQuery, queryParams, (err, result) => {
    if (err) {
      console.error('Database Error:', err);
      res.status(400).json({ message: "Error fetching recommendations", error: err.message });
    } else {
      // console.log('Sending /api/recommendations response:', result);
      res.status(200).json({ data: result });
    }
  });
};

const ProcessDialogflowQuery = async (req, res) => {
  const { text, languageCode = 'en' } = req.body;
  const DIALOGFLOW_PROJECT_ID = process.env.DIALOGFLOW_PROJECT_ID;

  if (!text) {
    return res.status(400).json({ message: 'Text input is required' });
  }

  if (!DIALOGFLOW_PROJECT_ID) {
    return res.status(500).json({ message: 'Dialogflow project ID not configured' });
  }

  try {
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/dialogflow'],
    });
    const client = await auth.getClient();
    const accessToken = (await client.getAccessToken()).token;

    if (!accessToken) {
      throw new Error('Failed to obtain access token');
    }

    // console.log('Access Token:', accessToken.substring(0, 20) + '...');
    // console.log('Sending Dialogflow request with text:', text);
    // console.log('Language Code:', languageCode);
    // console.log('Project ID:', DIALOGFLOW_PROJECT_ID);

    const sessionId = `session-${Date.now()}`;
    const response = await fetch(
      `https://dialogflow.googleapis.com/v2/projects/${DIALOGFLOW_PROJECT_ID}/agent/sessions/${sessionId}:detectIntent`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          queryInput: {
            text: {
              text,
              languageCode,
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Dialogflow API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    // console.log('Dialogflow Response:', JSON.stringify(data, null, 2));

    if (data.error) {
      throw new Error(data.error.message || 'Dialogflow API returned an error');
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Dialogflow Error:', error);
    res.status(400).json({ message: 'Error processing Dialogflow query', error: error.message });
  }
};

module.exports = { GetProductRecommendations, ProcessDialogflowQuery };