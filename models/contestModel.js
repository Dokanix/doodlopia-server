const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A contest must have a name'],
  },
  type: {
    type: String,
    enum: ['daily', 'weekly', 'monthly'],
    required: [true, 'A contest must have a type'],
  },
  startDate: {
    type: Date,
    required: [true, 'A contest must have a start date'],
  },
  endDate: {
    type: Date,
    required: [true, 'A contest must have an end date'],
  },
});

const Contest = mongoose.model('Contest', contestSchema);

module.exports = Contest;
