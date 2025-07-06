const express = require('express');
const router = express.Router();
const axios = require('axios');
const { hasuraEndpoint } = require('../config');

router.get('/network-test', async (req, res) => {
  try {
    const response = await axios.get(`${hasuraEndpoint.replace('/v1/graphql', '')}/healthz`, {
      timeout: 3000
    });
    res.json({ 
      success: true, 
      response: response.data,
      hasuraEndpoint: hasuraEndpoint
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error.message,
      config: error.config,
      stack: error.stack,
      hasuraEndpoint: hasuraEndpoint
    });
  }
});

module.exports = router;