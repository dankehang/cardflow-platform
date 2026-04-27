const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    card_number: {
        type: String,
        required: true,
        unique: true
    },
    card_type: {
        type: String,
        enum: ['debit', 'credit', 'prepaid'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'blocked'],
        default: 'inactive'
    },
    balance: {
        type: Number,
        default: 0
    },
    limit: {
        type: Number,
        default: 0
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    design_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Design'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    activated_at: {
        type: Date
    },
    expired_at: {
        type: Date
    }
});

module.exports = mongoose.model('Card', CardSchema);