const express = require('express');
const Card = require('../models/Card');
const Transaction = require('../models/Transaction');
const { auth } = require('../middleware/auth');

const router = express.Router();

// 获取卡片交易记录
router.get('/transactions/:card_id', auth, async (req, res) => {
    try {
        const card = await Card.findById(req.params.card_id);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }
        if (card.user_id.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const transactions = await Transaction.find({ card_id: req.params.card_id }).sort({ transaction_date: -1 });
        res.json(transactions);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// 获取用户所有交易记录
router.get('/transactions', auth, async (req, res) => {
    try {
        const cards = await Card.find({ user_id: req.user.id });
        const cardIds = cards.map(card => card._id);

        const transactions = await Transaction.find({ card_id: { $in: cardIds } }).sort({ transaction_date: -1 });
        res.json(transactions);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// 获取卡片余额和使用情况
router.get('/card/:card_id', auth, async (req, res) => {
    try {
        const card = await Card.findById(req.params.card_id);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }
        if (card.user_id.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // 获取最近的交易记录
        const recentTransactions = await Transaction.find({ card_id: req.params.card_id })
            .sort({ transaction_date: -1 })
            .limit(10);

        // 计算本月支出
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const monthlyExpenses = await Transaction.aggregate([
            { $match: { card_id: card._id, type: 'debit', transaction_date: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        res.json({
            card,
            recentTransactions,
            monthlyExpense: monthlyExpenses.length > 0 ? monthlyExpenses[0].total : 0
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// 获取用户卡片概览
router.get('/overview', auth, async (req, res) => {
    try {
        const cards = await Card.find({ user_id: req.user.id });
        const cardIds = cards.map(card => card._id);

        // 计算总余额
        const totalBalance = cards.reduce((sum, card) => sum + card.balance, 0);

        // 计算总支出（最近30天）
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const totalExpenses = await Transaction.aggregate([
            { $match: { card_id: { $in: cardIds }, type: 'debit', transaction_date: { $gte: thirtyDaysAgo } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // 按卡片类型统计
        const cardsByType = {};
        cards.forEach(card => {
            if (!cardsByType[card.card_type]) {
                cardsByType[card.card_type] = 0;
            }
            cardsByType[card.card_type]++;
        });

        res.json({
            totalCards: cards.length,
            totalBalance,
            totalExpense: totalExpenses.length > 0 ? totalExpenses[0].total : 0,
            cardsByType,
            activeCards: cards.filter(card => card.status === 'active').length
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// 获取支出分类统计
router.get('/categories', auth, async (req, res) => {
    try {
        const cards = await Card.find({ user_id: req.user.id });
        const cardIds = cards.map(card => card._id);

        // 按分类统计支出
        const categoryStats = await Transaction.aggregate([
            { $match: { card_id: { $in: cardIds }, type: 'debit' } },
            { $group: { _id: '$category', total: { $sum: '$amount' } } },
            { $sort: { total: -1 } }
        ]);

        res.json(categoryStats);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;