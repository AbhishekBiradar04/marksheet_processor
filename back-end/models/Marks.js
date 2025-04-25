const mongoose = require('mongoose');

const MarksSchema = new mongoose.Schema({
  section: String,
  usn: String,
  subject: String,
  marksDetails: Object,
}, { collection: 'marksData' });

module.exports = mongoose.model('Marks', MarksSchema);