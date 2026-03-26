import { Router } from 'express';
import patientController from '../controllers/patientController';

const router = Router();

router.post('/', patientController.create);
router.get('/', patientController.list);
router.get('/:id', patientController.getOne);
router.put('/:id', patientController.update);
router.delete('/:id', patientController.delete);

export default router;
