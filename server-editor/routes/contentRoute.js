const express = require('express');
const router = express.Router();
const Content = require('../models/contentModel');
const { protect } = require('../middleware/authcontent');
const { body, validationResult } = require('express-validator');

// Validation middleware
const contentValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('status').optional().isIn(['draft', 'published']),
  body('tags').optional().isArray(),
  body('description').optional().trim()
];

// Create new content
router.post('/', protect, contentValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, description, status, tags } = req.body;

    const newContent = await Content.create({
      user: req.user._id,
      title,
      content,
      description,
      status,
      tags
    });

    res.status(201).json(newContent);
  } catch (error) {
    res.status(500).json({ message: 'Error creating content', error: error.message });
  }
});

// Get all content for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status;
    const search = req.query.search;

    let query = { user: req.user._id };
    
    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    // Add search functionality if search term provided
    if (search) {
      query.$text = { $search: search };
    }

    const contents = await Content.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Content.countDocuments(query);

    res.json({
      contents,
      page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching content', error: error.message });
  }
});

// Get single content by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const content = await Content.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching content', error: error.message });
  }
});

// Update content
router.put('/:id', protect, contentValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, description, status, tags } = req.body;

    let contentToUpdate = await Content.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!contentToUpdate) {
      return res.status(404).json({ message: 'Content not found' });
    }

    contentToUpdate.title = title;
    contentToUpdate.content = content;
    contentToUpdate.description = description;
    contentToUpdate.status = status;
    contentToUpdate.tags = tags;

    const updatedContent = await contentToUpdate.save();

    res.json(updatedContent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating content', error: error.message });
  }
});

// Delete content
router.delete('/:id', protect, async (req, res) => {
  try {
    const content = await Content.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    await content.remove();
    res.json({ message: 'Content deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting content', error: error.message });
  }
});

// Get content statistics
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const stats = await Content.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalContent = await Content.countDocuments({ user: req.user._id });
    const recentContent = await Content.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats,
      totalContent,
      recentContent
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

module.exports = router;