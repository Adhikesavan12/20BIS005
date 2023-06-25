const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;
  const numbers = new Set();
    const promises = urls.map(async (url) => {
      try {
        const response = await axios.get(url, { timeout: 500 });
        if (response.status === 200) {
          const data = response.data;
          if (data.numbers && Array.isArray(data.numbers)) {
            data.numbers.forEach((number) => numbers.add(number));
          }
        }
      } catch (error) {
        console.error(`Error fetching data from URL: ${url}`);
        console.error(error);
      }
    });

    await Promise.all(promises);
    
  const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
  const response = { numbers: sortedNumbers };
  res.json(response);
});

const port = 8008;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
