const express = require('express');
const JournalEntry = require('../models/JournalEntry');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all journal entries for user
router.get('/', auth, async (req, res) => {
  try {
    const entries = await JournalEntry.find({ user: req.user._id })
      .sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single journal entry
router.get('/:id', auth, async (req, res) => {
  try {
    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create journal entry
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, mood, tags } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const entry = new JournalEntry({
      user: req.user._id,
      title: title || 'Untitled Entry',
      content,
      mood: mood || 'neutral',
      tags: tags || []
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update journal entry
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, mood, tags } = req.body;

    const entry = await JournalEntry.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    if (title !== undefined) entry.title = title;
    if (content !== undefined) entry.content = content;
    if (mood !== undefined) entry.mood = mood;
    if (tags !== undefined) entry.tags = tags;

    // Reset AI insights if content changed
    if (content !== undefined) {
      entry.aiInsightsGenerated = false;
      entry.aiInsights = '';
      entry.detectedStates = {
        anxiety: 0,
        burnout: 0,
        sadness: 0,
        confidence: 0
      };
      entry.recommendations = {
        positivity: '',
        meditation: '',
        tasks: []
      };
    }

    await entry.save();
    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete journal entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await JournalEntry.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

