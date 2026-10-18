
const crypto = require('crypto');
const Url = require('../models/Url');

const BASE_URL = process.env.BASE_URL || 'http://localhost:4011';

// Display the homepage
exports.getHome = async (req, res) => {
    try {
        const urls = await Url.find().sort({ createdAt: -1 });

        res.render('index', {
            urls,
            baseUrl: BASE_URL,
            error: null
        });
    } catch (error) {
        console.error('READ failed:', error.message);
        res.status(500).send('Could not load URLs.');
    }
};

// Create a shortened URL
exports.createUrl = async (req, res) => {
    try {
        let { originalUrl, customCode } = req.body;

        originalUrl = originalUrl?.trim();
        customCode = customCode?.trim();

        if (!originalUrl) {
            return res.status(400).send('Please enter a URL.');
        }

        let parsedUrl;

        try {
            parsedUrl = new URL(originalUrl);
        } catch {
            return res.status(400).send('Please enter a valid URL.');
        }

        if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
            return res.status(400).send('Only HTTP and HTTPS URLs are allowed.');
        }

        let shortCode;

        if (customCode) {
            if (!/^[a-zA-Z0-9_-]{3,30}$/.test(customCode)) {
                return res.status(400).send(
                    'Custom codes must be 3–30 letters, numbers, hyphens or underscores.'
                );
            }

            shortCode = customCode;
        } else {
            shortCode = crypto.randomBytes(5).toString('base64url');
        }

        const existing = await Url.findOne({ shortCode });

        if (existing) {
            return res.status(409).send(
                'This short code already exists. Try another.'
            );
        }

        const url = await Url.create({
            originalUrl: parsedUrl.href,
            shortCode
        });

        console.log('✅ URL created:', `${BASE_URL}/${url.shortCode}`);

        res.redirect('/');
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).send(
                'That short code is already in use. Please try another.'
            );
        }

        console.error('CREATE failed:', error.message);
        res.status(500).send('Could not create the short URL.');
    }
};

// Redirect a short link to its destination
exports.redirectUrl = async (req, res) => {
    try {
        const url = await Url.findOneAndUpdate(
            { shortCode: req.params.code },
            { $inc: { clicks: 1 } },
            { new: true }
        );

        if (!url) {
            return res.status(404).send('Short URL not found.');
        }

        console.log(
            `↗️ Redirect: /${url.shortCode} → ${url.originalUrl}`
        );

        res.redirect(302, url.originalUrl);
    } catch (error) {
        console.error('REDIRECT failed:', error.message);
        res.status(500).send('Could not redirect to the destination.');
    }
};

// Delete a shortened URL
exports.deleteUrl = async (req, res) => {
    try {
        const url = await Url.findByIdAndDelete(req.params.id);

        if (!url) {
            return res.status(404).send('Short URL not found.');
        }

        console.log('🗑️ URL deleted:', url.shortCode);

        res.redirect('/');
    } catch (error) {
        console.error('DELETE failed:', error.message);
        res.status(400).send('Invalid URL record ID.');
    }
};
