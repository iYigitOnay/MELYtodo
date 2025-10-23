import { Router } from 'express';
import { generateStory, translateStory, getStories, getStoryById, deleteStory } from '../controllers/story_controller.js';
import { protect } from '../middleware/auth_middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Story
 *   description: Story generation and translation operations
 */

/**
 * @swagger
 * /api/story/generate:
 *   post:
 *     summary: Generate a story based on a topic
 *     tags: [Story]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - topic
 *             properties:
 *               topic:
 *                 type: string
 *                 description: The topic for the story generation
 *     responses:
 *       201:
 *         description: Story generated successfully
 *       400:
 *         description: Bad request (e.g., missing topic)
 *       401:
 *         description: Unauthorized (e.g., missing or invalid token)
 *       500:
 *         description: Server error
 */
router.post('/generate', protect, generateStory);

/**
 * @swagger
 * /api/story/translate:
 *   post:
 *     summary: Translate and simplify a story to A1/A2 level
 *     tags: [Story]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - storyId
 *               - story
 *               - language
 *             properties:
 *               storyId:
 *                 type: string
 *                 description: The ID of the story to translate
 *               story:
 *                 type: string
 *                 description: The original story text to translate
 *               language:
 *                 type: string
 *                 enum: [english, french]
 *                 description: The target language for translation (e.g., 'english', 'french')
 *     responses:
 *       200:
 *         description: Story translated successfully
 *       400:
 *         description: Bad request (e.g., missing parameters, unsupported language)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Story not found
 *       500:
 *         description: Server error
 */
router.post('/translate', protect, translateStory);

/**
 * @swagger
 * /api/story:
 *   get:
 *     summary: Get all stories for the authenticated user
 *     tags: [Story]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of stories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Story'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', protect, getStories);

/**
 * @swagger
 * /api/story/{id}:
 *   get:
 *     summary: Get a story by its ID
 *     tags: [Story]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The story ID
 *     responses:
 *       200:
 *         description: A single story object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Story'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Story not found
 *       500:
 *         description: Server error
 *   delete:
 *     summary: Delete a story by its ID
 *     tags: [Story]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The story ID
 *     responses:
 *       200:
 *         description: Story deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Story not found
 *       500:
 *         description: Server error
 */
router.get('/:id', protect, getStoryById);
router.delete('/:id', protect, deleteStory);

export default router;