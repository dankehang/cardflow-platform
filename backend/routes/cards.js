const express = require('express');
const { body, validationResult } = require('express-validator');
const Card = require('../models/Card');
const { auth } = require('../middleware/auth');

const router = express.Router();

// 创建卡片
router.post('/', auth, [
    body('card_number', 'Card number is required').not().isEmpty(),
    body('card_type', 'Card type is required').isIn(['debit', 'credit', 'prepaid'])
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { card_number, card_type, limit, design_id } = req.body;

    try {
        let card = await Card.findOne({ card_number });
        if (card) {
            return res.status(400).json({ message: 'Card already exists' });
        }

        card = new Card({
            card_number,
            card_type,
            limit,
            user_id: req.user.id,
            design_id
        });

        await card.save();
        res.json(card);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// 获取用户的所有卡片
router.get('/', auth, async (req, res) => {
    try {
        const cards = await Card.find({ user_id: req.user.id });
        res.json(cards);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// 获取单个卡片
router.get('/:id', auth, async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }
        if (card.user_id.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        res.json(card);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// 更新卡片
router.put('/:id', auth, async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }
        if (card.user_id.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { limit, design_id } = req.body;
        if (limit !== undefined) card.limit = limit;
        if (design_id !== undefined) card.design_id = design_id;

        await card.save();
        res.json(card);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// 删除卡片
router.delete('/:id', auth, async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }
        if (card.user_id.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await card.remove();
        res.json({ message: 'Card removed' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// 激活卡片
router.put('/:id/activate', auth, async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }
        if (card.user_id.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        card.status = 'active';
        card.activated_at = new Date();
        await card.save();
        res.json(card);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// 停用卡片
router.put('/:id/deactivate', auth, async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }
        if (card.user_id.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        card.status = 'inactive';
        await card.save();
        res.json(card);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// 冻结卡片
router.put('/:id/block', auth, async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }
        if (card.user_id.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        card.status = 'blocked';
        await card.save();
        res.json(card);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;