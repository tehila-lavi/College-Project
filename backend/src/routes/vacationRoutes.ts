import express, { Request, Response } from 'express';
import vacationController from '../controllers/VacationController';
import { verifyToken, verifyAdmin, AuthenticatedRequest } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', verifyToken, async (req: Request, res: Response) => {
    try {
        const userId = (req as AuthenticatedRequest).user!.id;
        const vacations = await vacationController.getVacations(userId);
        res.json(vacations);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', verifyToken, verifyAdmin, async (req: Request, res: Response) => {
    try {
        const newVacation = await vacationController.addVacation(req.body);
        res.status(201).json(newVacation);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/:id', verifyToken, verifyAdmin, async (req: Request, res: Response) => {
    try {
        const updatedVacation = await vacationController.updateVacation(req.params.id as string, req.body);
        res.json(updatedVacation);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/:id', verifyToken, verifyAdmin, async (req: Request, res: Response) => {
    try {
        await vacationController.deleteVacation(req.params.id as string);
        res.status(204).send("Vacation deleted successfully");
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/follow', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { vacationId } = req.body;
        const userId = req.user!.id;

        await vacationController.followVacation(userId, vacationId);
        res.status(200).json({ message: 'Follow status updated' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
