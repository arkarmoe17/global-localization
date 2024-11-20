const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieSession = require('cookie-session');
const fs = require('fs');
const User = require('./models/User'); // User model
const app = express();
const port = 3000;

// Read the JSON data from the file
const data = JSON.parse(fs.readFileSync('country.json', 'utf8'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/local-trading', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Configure cookie session
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport to use Google OAuth 2.0
passport.use(new GoogleStrategy({
    clientID: 'YOUR_GOOGLE_CLIENT_ID',
    clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
    callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
    // Find or create user in the database
    User.findOne({googleId: profile.id}, (err, user) => {
        if (err) return done(err);
        if (user) {
            return done(null, user);
        } else {
            const newUser = new User({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value
            });
            newUser.save((err) => {
                if (err) return done(err);
                return done(null, newUser);
            });
        }
    });
}));

// Serialize user to the session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// Routes
app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

app.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/'}), (req, res) => {
    res.redirect('/profile');
});

app.get('/profile', (req, res) => {
    if (!req.user) {
        return res.redirect('/');
    }
    res.send(`Hello, ${req.user.displayName}`);
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

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

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});