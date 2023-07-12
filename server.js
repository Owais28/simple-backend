const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Create a POST endpoint /getWeather
app.post('/getWeather', async (req, res) => {
  const { cities } = req.body;

  const options = {
    method: 'GET',
    url: 'https://weatherapi-com.p.rapidapi.com/current.json',
    // params: {q: 'New Delhi'},
    headers: {
      'X-RapidAPI-Key': 'ba06971fa1mshca44a3afebbd590p104b7fjsn53cdb79e04b7',
      'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
    }
  };

  try {
    const weatherData = await Promise.all(
      cities.map(async (city) => {

        const customisedReq = {...options, params : {q : city}};
        const response = await axios.request(customisedReq);
        const temperature = response.data.current.feelslike_c;
        console.log(response)

        return { [city]: `${temperature}°C` };
      })
    );

    const weather = weatherData.reduce((acc, curr) => Object.assign(acc, curr), {});

    res.json({ weather });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Start the server
const port = 3000; // You can change the port as needed
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
