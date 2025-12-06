const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'Untitled Entry'
  },
  content: {
    type: String,
    required: true
  },
  mood: {
    type: String,
    enum: ['excited', 'happy', 'calm', 'neutral', 'sad', 'anxious', 'angry', 'tired'],
    default: 'neutral'
  },
  tags: [{
    type: String
  }],
  aiInsights: {
    type: String,
    default: ''
  },
  aiInsightsGenerated: {
    type: Boolean,
    default: false
  },
  detectedStates: {
    anxiety: { type: Number, min: 0, max: 100, default: 0 },
    burnout: { type: Number, min: 0, max: 100, default: 0 },
    sadness: { type: Number, min: 0, max: 100, default: 0 },
    confidence: { type: Number, min: 0, max: 100, default: 0 }
  },
  recommendations: {
    positivity: { type: String, default: '' },
    meditation: { type: String, default: '' },
    tasks: [{ type: String }]
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('JournalEntry', journalEntrySchema);

