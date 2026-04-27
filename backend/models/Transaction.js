const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    card_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['debit', 'credit'],
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['success', 'failed', 'pending'],
        default: 'pending'
    },
    transaction_date: {
        type: Date,
        default: Date.now
    },
    merchant: {
        type: String
    },
    category: {
        type: String
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);