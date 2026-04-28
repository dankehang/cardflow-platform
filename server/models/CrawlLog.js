const mongoose = require('mongoose');

const CrawlLogSchema = new mongoose.Schema({
    source: { type: String, required: true },
    jobCount: { type: Number, default: 0 },
    newJobCount: { type: Number, default: 0 },
    status: { type: String, enum: ['success', 'failed'], required: true },
    errorMessage: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CrawlLog', CrawlLogSchema);