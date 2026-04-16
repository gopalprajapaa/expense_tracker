import {Router} from 'express'
import { getReport } from './dashboard.controller.js';
import { AdminUserGuard } from '../middleware/guide.middleware.js';

const DashboardRouter=Router();

DashboardRouter.get("/report",AdminUserGuard,getReport);

export default DashboardRouter;
