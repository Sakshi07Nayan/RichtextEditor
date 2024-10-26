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

// Get all content for logged-in user (Simplified version)

router.get('/', protect, async (req, res) => {
  try {
    const contents = await Content.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean(); // Optional: Converts to a plain JavaScript object
    res.status(200).json(contents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching content', error: error.message });
  }
});

// Get a single content item by ID
router.get('/:id', protect, async (req, res) => {
  try {
    const content = await Content.findOne({ _id: req.params.id, user: req.user._id }).lean();
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.status(200).json(content);
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

    const updatedContent = await Content.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id
      },
      {
        title,
        content,
        description,
        status,
        tags
      },
      { new: true }
    );

    if (!updatedContent) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json(updatedContent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating content', error: error.message });
  }
});

// Delete content
router.delete('/:id', protect, async (req, res) => {
  try {
    const content = await Content.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting content', error: error.message });
  }
});

module.exports = router;