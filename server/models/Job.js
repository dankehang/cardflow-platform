const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String, default: '面议' },
    requirements: { type: String, default: '' },
    description: { type: String, default: '' },
    source: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    isNew: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', JobSchema);