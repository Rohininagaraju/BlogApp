import dotenv from 'dotenv';
dotenv.config();
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
//import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';

const router = Router();

// Register
router.post('/register', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('name').notEmpty().withMessage('Name is required')
], async (req: Request, res: Response) => {
    try {
        const { email, password, name } = req.body;

        // Check if user already exists
        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOneBy({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = userRepository.create({
            email,
            password: hashedPassword,
            name
        });

        await userRepository.save(user);
        // Generate token
        const payload = { id: user.id };
        const secret = String(process.env.JWT_SECRET || 'your_jwt_secret_key') as jwt.Secret;
        const expiresIn = String(process.env.JWT_EXPIRES_IN || '24h');
        const token = jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
], async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Find user
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOneBy({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        // Generate token
        const payload = { id: user.id };
        const secret = String(process.env.JWT_SECRET || 'your_jwt_secret_key') as jwt.Secret;
        const expiresIn = String(process.env.JWT_EXPIRES_IN || '24h');
        const token = jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router; 