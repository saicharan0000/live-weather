const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

dotenv.config();
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

app.use(rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: 'Rate limit exceeded. Try again later.'
}));

app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'City is required' });

  try {
    const apiKey = process.env.WEATHER_API_KEY;
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
    const response = await axios.get(url);

    const data = {
      name: response.data.location.name,
      country: response.data.location.country,
      temp_c: response.data.current.temp_c,
      condition: response.data.current.condition.text,
      icon: response.data.current.condition.icon,
    };

    res.json(data);
  } catch (err) {
    console.error('🌩️ Weather API Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Weather API failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
