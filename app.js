const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');
const postRouter = require('./routes/postRoutes');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/local-trading', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Middleware
app.use(bodyParser.json());

// Read the JSON data from the file
const data = JSON.parse(fs.readFileSync('country.json', 'utf8'));

// Common API
app.get('/data', (req, res) => {
    const {countryKey, regionKey} = req.query;
    console.log(`countryKey: ${countryKey} | regionKey: ${regionKey}`);

    if (!countryKey && !regionKey) {
        console.log("No key is provided");
        // If no keys are provided, return all country information
        return res.json({
            country: data.country
        });
    }

    const country = data.country.find(c => c.key === countryKey);
    if (!country) {
        return res.status(404).send('Country not found');
    }

    if (countryKey && !regionKey) {
        console.log("countryKey is provided");
        // If only countryKey is provided, return the country and its regions
        const regions = data.region.find(r => r.countryRefKey === countryKey) || {data: []};
        return res.json({
            country,
            region: regions.data
        });
    }

    if (countryKey && regionKey) {
        console.log("countryKey and regionKey are provided");
        // If both countryKey and regionKey are provided, return the country, its regions, and townships
        const regions = data.region.find(r => r.countryRefKey === countryKey) || {data: []};
        const regionData = data.township.find(t => t.countryRefKey === countryKey) || {data: []};
        const township = regionData.data.find(r => r.regionRefKey === regionKey) || {data: []};
        return res.json({
            country,
            region: regions.data,
            township: township.data
        });
    }

    // error handling
    return res.status(404).send('Invalid data request.');
});

// Post API
app.use('/posts', postRouter);

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});