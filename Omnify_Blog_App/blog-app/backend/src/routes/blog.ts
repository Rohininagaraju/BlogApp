import { Router } from 'express';
import { body } from 'express-validator';
import { AppDataSource } from '../config/database';
import { Blog } from '../models/Blog';
import { auth, AuthRequest } from '../middleware/auth';
import { Request, Response } from 'express';

const router = Router();

// Get all blogs with pagination
router.get('/', async (req: AuthRequest, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const size = parseInt(req.query.size as string) || 10;
        const skip = (page - 1) * size;

        const blogRepository = AppDataSource.getRepository(Blog);
        const [blogs, total] = await blogRepository.findAndCount({
            relations: ['author'],
            order: { createdAt: 'DESC' },
            skip,
            take: size
        });

        res.json({
            content: blogs,
            totalElements: total,
            totalPages: Math.ceil(total / size),
            size,
            number: page
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get single blog
router.get('/:id', async (req: AuthRequest, res: Response) => {
    try {
        const blogRepository = AppDataSource.getRepository(Blog);
        const blog = await blogRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ['author']
        });

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Create blog
router.post('/', auth, [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required')
], async (req: AuthRequest, res: Response) => {
    try {
        const { title, content } = req.body;
        const blogRepository = AppDataSource.getRepository(Blog);

        const blog = blogRepository.create({
            title,
            content,
            author: req.user
        });

        await blogRepository.save(blog);
        res.status(201).json(blog);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update blog
router.put('/:id', auth, [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required')
], async (req: AuthRequest, res: Response) => {
    try {
        const blogRepository = AppDataSource.getRepository(Blog);
        const blog = await blogRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ['author']
        });

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        if (blog.author.id !== req.user?.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        blog.title = req.body.title;
        blog.content = req.body.content;
        await blogRepository.save(blog);

        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete blog
router.delete('/:id', auth, async (req: AuthRequest, res) => {
    try {
        const blogRepository = AppDataSource.getRepository(Blog);
        const blog = await blogRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ['author']
        });

        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }

        if (blog.author.id !== req.user?.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await blogRepository.remove(blog);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router; 