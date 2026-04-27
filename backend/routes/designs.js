const express = require('express');
const { body, validationResult } = require('express-validator');
const Design = require('../models/Design');
const { auth } = require('../middleware/auth');

const router = express.Router();

// 创建卡片设计
router.post('/', auth, [
    body('name', 'Name is required').not().isEmpty(),
    body('color_scheme', 'Color scheme is required').not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, color_scheme, logo_url, background_image, is_default } = req.body;

    try {
        if (is_default) {
            // 如果设置为默认设计，将其他设计的is_default设置为false
            await Design.updateMany({ user_id: req.user.id }, { is_default: false });
        }

        const design = new Design({
            name,
            description,
            color_scheme,
            logo_url,
            background_image,
            user_id: req.user.id,
            is_default
        });

        await design.save();
        res.json(design);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// 获取用户的所有设计
router.get('/', auth, async (req, res) => {
    try {
        const designs = await Design.find({ user_id: req.user.id });
        res.json(designs);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// 获取单个设计
router.get('/:id', auth, async (req, res) => {
    try {
        const design = await Design.findById(req.params.id);
        if (!design) {
            return res.status(404).json({ message: 'Design not found' });
        }
        if (design.user_id.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        res.json(design);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// 更新设计
router.put('/:id', auth, async (req, res) => {
    try {
        const design = await Design.findById(req.params.id);
        if (!design) {
            return res.status(404).json({ message: 'Design not found' });
        }
        if (design.user_id.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const { name, description, color_scheme, logo_url, background_image, is_default } = req.body;
        
        if (is_default) {
            // 如果设置为默认设计，将其他设计的is_default设置为false
            await Design.updateMany({ user_id: req.user.id }, { is_default: false });
        }

        if (name !== undefined) design.name = name;
        if (description !== undefined) design.description = description;
        if (color_scheme !== undefined) design.color_scheme = color_scheme;
        if (logo_url !== undefined) design.logo_url = logo_url;
        if (background_image !== undefined) design.background_image = background_image;
        if (is_default !== undefined) design.is_default = is_default;

        await design.save();
        res.json(design);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// 删除设计
router.delete('/:id', auth, async (req, res) => {
    try {
        const design = await Design.findById(req.params.id);
        if (!design) {
            return res.status(404).json({ message: 'Design not found' });
        }
        if (design.user_id.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await design.remove();
        res.json({ message: 'Design removed' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;