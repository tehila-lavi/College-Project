import express, { Request, Response } from 'express';
import authController from '../controllers/AuthController';

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
    try {
        const { username, password, adminSecret, firstName, lastName } = req.body;

        if (await authController.isUserExists(username)) {
            res.status(400).json({ message: 'Username already exists' });
            return;
        }

        const newUser = await authController.register({ username, password, firstName, lastName }, adminSecret);

        res.status(201).json(newUser);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/login', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const { user, token } = await authController.login(username, password);
        res.status(200).json({ user, token });
    } catch (error: any) {
        res.status(401).send({ message: error.message });
    }
});

export default router;
