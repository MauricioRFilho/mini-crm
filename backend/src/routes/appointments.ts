import { Router } from 'express';
import appointmentController from '../controllers/appointmentController';

const router = Router();

router.post('/', appointmentController.create);
router.get('/', appointmentController.list);
router.get('/:id', appointmentController.getOne);
router.put('/:id', appointmentController.update);
router.patch('/:id/status', appointmentController.advanceStatus);
router.delete('/:id', appointmentController.delete);

export default router;
