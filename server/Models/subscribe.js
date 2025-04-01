const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

// Basic Subscription Schema
const basicSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  limit: { type: Number, required: true, default: 30 } // Usage limit for basic plan
});

// Intermediate Subscription Schema
const intermediateSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  limit: { type: Number, required: true, default: 60 } // Usage limit for intermediate plan
});

// Advanced Subscription Schema
const advancedSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  limit: { type: Number, required: true, default: 90 } // Usage limit for advanced plan
});

// Main Subscribe Schema
const subscribeSchema = new mongoose.Schema({
  subId: { type: Number, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subTypeId: { type: Number, required: true }, // 1 for Basic, 2 for Intermediate, 3 for Advanced
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
});

// Apply auto-incrementing plugin to subscribe schema
subscribeSchema.plugin(AutoIncrement, { inc_field: 'subId' });

// Export models
module.exports = {
  Basic: mongoose.model('Basic', basicSchema),
  Intermediate: mongoose.model('Intermediate', intermediateSchema),
  Advanced: mongoose.model('Advanced', advancedSchema),
  Subscribe: mongoose.model('Subscribe', subscribeSchema)
};