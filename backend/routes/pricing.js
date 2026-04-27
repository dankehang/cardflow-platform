const express = require('express');
const { body, validationResult } = require('express-validator');
const Pricing = require('../models/Pricing');
const { auth, admin } = require('../middleware/auth');

const router = express.Router();

// 获取所有定价方案
router.get('/', async (req, res) => {
    try {
        const pricingPlans = await Pricing.find();
        res.json(pricingPlans);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// 获取推荐定价方案
router.get('/recommended', async (req, res) => {
    try {
        const recommendedPlan = await Pricing.findOne({ is_recommended: true });
        res.json(recommendedPlan);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// 创建定价方案（仅管理员）
router.post('/', [auth, admin], [
    body('name', 'Name is required').not().isEmpty(),
    body('price', 'Price is required').isNumeric(),
    body('features', 'Features are required').isArray(),
    body('card_limit', 'Card limit is required').isNumeric()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, price, currency, billing_cycle, features, card_limit, is_recommended } = req.body;

    try {
        if (is_recommended) {
            // 如果设置为推荐方案，将其他方案的is_recommended设置为false
            await Pricing.updateMany({}, { is_recommended: false });
        }

        const pricingPlan = new Pricing({
            name,
            description,
            price,
            currency,
            billing_cycle,
            features,
            card_limit,
            is_recommended
        });

        await pricingPlan.save();
        res.json(pricingPlan);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// 更新定价方案（仅管理员）
router.put('/:id', [auth, admin], async (req, res) => {
    try {
        const pricingPlan = await Pricing.findById(req.params.id);
        if (!pricingPlan) {
            return res.status(404).json({ message: 'Pricing plan not found' });
        }

        const { name, description, price, currency, billing_cycle, features, card_limit, is_recommended } = req.body;
        
        if (is_recommended) {
            // 如果设置为推荐方案，将其他方案的is_recommended设置为false
            await Pricing.updateMany({}, { is_recommended: false });
        }

        if (name !== undefined) pricingPlan.name = name;
        if (description !== undefined) pricingPlan.description = description;
        if (price !== undefined) pricingPlan.price = price;
        if (currency !== undefined) pricingPlan.currency = currency;
        if (billing_cycle !== undefined) pricingPlan.billing_cycle = billing_cycle;
        if (features !== undefined) pricingPlan.features = features;
        if (card_limit !== undefined) pricingPlan.card_limit = card_limit;
        if (is_recommended !== undefined) pricingPlan.is_recommended = is_recommended;

        await pricingPlan.save();
        res.json(pricingPlan);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// 删除定价方案（仅管理员）
router.delete('/:id', [auth, admin], async (req, res) => {
    try {
        const pricingPlan = await Pricing.findById(req.params.id);
        if (!pricingPlan) {
            return res.status(404).json({ message: 'Pricing plan not found' });
        }

        await pricingPlan.remove();
        res.json({ message: 'Pricing plan removed' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;