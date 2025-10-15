import { Router } from 'express';
import { generateStory, translateStory, getStories, getStoryById } from '../controllers/story_controller.js';
import { protect } from '../middleware/auth_middleware.js';

const router = Router();

// @route   POST /api/story/generate
// @desc    Bir konuya göre hikaye oluşturur (Korumalı)
router.post('/generate', protect, generateStory);

// @route   POST /api/story/translate
// @desc    Bir hikayeyi basitleştirilmiş A1/A2 seviyesine çevirir (Korumalı)
router.post('/translate', protect, translateStory);

// @route   GET /api/story
// @desc    Get all stories for a user (Protected)
router.get('/', protect, getStories);

// @route   GET /api/story/:id
// @desc    Get a story by ID (Protected)
router.get('/:id', protect, getStoryById);

export default router;