const Post = require('../models/Post');

const createPost = async (title, content, author) => {
    const newPost = new Post({ title, content, author });
    return await newPost.save();
};

const getAllPosts = async () => {
    return await Post.find().sort({ createdAt: -1 });
};


module.exports = {
    createPost,
    getAllPosts
};