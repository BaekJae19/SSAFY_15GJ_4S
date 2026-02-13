import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller';

const router = Router();

router.get('/knowledge/today', dashboardController.getTodayKnowledge);
router.get('/menu/today', dashboardController.getTodayMenu);
router.get('/events/upcoming', dashboardController.getUpcomingEvents);
router.get('/events/dday', dashboardController.getDdayEvent);

export default router;
