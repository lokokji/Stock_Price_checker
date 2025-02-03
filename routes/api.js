const express = require('express');
const axios = require('axios');
const Stock = require('../models/Stock');
const router = express.Router();

// Helper function to anonymize IP addresses
const anonymizeIP = (ip) => ip.split('.').slice(0, 2).join('.') + '.0.0';

// Fetch stock data from the proxy API
const fetchStockPrice = async (symbol) => {
  const response = await axios.get(
    `https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${symbol}/quote`
  );
  return response.data;
};

// GET /api/stock-prices
router.get('/stock-prices', async (req, res) => {
  const { stock, like } = req.query;
  const ip = anonymizeIP(req.ip);

  try {
    if (Array.isArray(stock)) {
      // Handle two stocks
      const [stock1, stock2] = stock;
      const [price1, price2] = await Promise.all([
        fetchStockPrice(stock1),
        fetchStockPrice(stock2),
      ]);

      const stockData1 = await Stock.findOneAndUpdate(
        { symbol: stock1 },
        { $addToSet: { likes: like === 'true' ? ip : null } },
        { new: true, upsert: true }
      );

      const stockData2 = await Stock.findOneAndUpdate(
        { symbol: stock2 },
        { $addToSet: { likes: like === 'true' ? ip : null } },
        { new: true, upsert: true }
      );

      res.json({
        stockData: [
          {
            stock: stock1,
            price: price1.latestPrice,
            rel_likes: stockData1.likes.length - stockData2.likes.length,
          },
          {
            stock: stock2,
            price: price2.latestPrice,
            rel_likes: stockData2.likes.length - stockData1.likes.length,
          },
        ],
      });
    } else {
      // Handle one stock
      const price = await fetchStockPrice(stock);
      const stockData = await Stock.findOneAndUpdate(
        { symbol: stock },
        { $addToSet: { likes: like === 'true' ? ip : null } },
        { new: true, upsert: true }
      );

      res.json({
        stockData: {
          stock,
          price: price.latestPrice,
          likes: stockData.likes.length,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;