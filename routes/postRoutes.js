const express = require('express');
const postService = require('../services/postService');

const router = express.Router();

// Create a new post
router.post('/', async (req, res) => {
    const { title, content, author } = req.body;
    try {
        const savedPost = await postService.createPost(title, content, author);
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all posts
router.get('/', async (req, res) => {
    try {
        const posts = await postService.getAllPosts();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;