const { mongoose } = require('./_db');
const bcrypt = require('bcryptjs');

// 用户模型
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    company: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// 密码加密
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// 密码验证
UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// 卡片模型
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

// 卡片设计模型
const DesignSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    color_scheme: {
        type: Object,
        required: true
    },
    logo_url: {
        type: String
    },
    background_image: {
        type: String
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    is_default: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// 交易模型
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

// 定价模型
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

// 导出模型
const User = mongoose.model('User', UserSchema);
const Card = mongoose.model('Card', CardSchema);
const Design = mongoose.model('Design', DesignSchema);
const Transaction = mongoose.model('Transaction', TransactionSchema);
const Pricing = mongoose.model('Pricing', PricingSchema);

module.exports = {
    User,
    Card,
    Design,
    Transaction,
    Pricing
};