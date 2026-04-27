const mongoose = require('mongoose');

const PricingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'CNY'
    },
    billing_cycle: {
        type: String,
        enum: ['monthly', 'yearly'],
        default: 'monthly'
    },
    features: {
        type: Array,
        required: true
    },
    card_limit: {
        type: Number,
        required: true
    },
    is_recommended: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Pricing', PricingSchema);