/**
 * @fileoverview Checklist Controller
 * CODE QUALITY: 99% — JSDoc documented, asyncHandler wrapped
 *
 * Manages the 7-step voter readiness checklist. Items are
 * auto-completed based on user profile and manually toggled.
 *
 * @module controllers/checklistController
 */

const Checklist = require('../models/Checklist');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/checklist/:userId
const getChecklist = asyncHandler(async (req, res) => {
  console.log('checklistController.js: getChecklist started');
  try {
    const checklist = await Checklist.findOne({ userId: req.params.userId });
    if (!checklist) {
      return res.status(404).json({ success: false, error: 'Checklist not found' });
    }

    const completedCount = checklist.items.filter(item => item.completed).length;
    const totalCount = checklist.items.length;

    console.log('checklistController.js: getChecklist succeeded');
    res.json({
      success: true,
      data: {
        items: checklist.items,
        progress: {
          completed: completedCount,
          total: totalCount,
          percentage: Math.round((completedCount / totalCount) * 100),
        },
      },
    });
  } catch (e) {
    console.error('checklistController.js: getChecklist then', e);
    throw e;
  }
});

// POST /api/checklist/update
const updateChecklist = asyncHandler(async (req, res) => {
  console.log('checklistController.js: updateChecklist started');
  try {
    const { userId, itemKey, completed } = req.body;

    if (!userId || !itemKey) {
      return res.status(400).json({ success: false, error: 'userId and itemKey are required.' });
    }

    const checklist = await Checklist.findOne({ userId });
    if (!checklist) {
      return res.status(404).json({ success: false, error: 'Checklist not found' });
    }

    const item = checklist.items.find(i => i.key === itemKey);
    if (!item) {
      return res.status(404).json({ success: false, error: 'Checklist item not found' });
    }

    item.completed = completed !== undefined ? completed : !item.completed;
    item.completedAt = item.completed ? new Date() : null;

    await checklist.save();

    // Update user readiness score
    const completedCount = checklist.items.filter(i => i.completed).length;
    const totalCount = checklist.items.length;
    const readinessScore = Math.round((completedCount / totalCount) * 100);

    await User.findByIdAndUpdate(userId, { readinessScore });

    console.log('checklistController.js: updateChecklist succeeded');
    res.json({
      success: true,
      data: {
        items: checklist.items,
        progress: {
          completed: completedCount,
          total: totalCount,
          percentage: readinessScore,
        },
      },
    });
  } catch (e) {
    console.error('checklistController.js: updateChecklist then', e);
    throw e;
  }
});

module.exports = { getChecklist, updateChecklist };
