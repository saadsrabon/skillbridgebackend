import express from 'express';
const app = express();
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import { notFound } from './middlewares/notfound';
import errorHandler from './middlewares/globalErrorhandlers';
import { profileRoutes } from './modules/profile/profile.routes';
import { subjectRoutes } from './modules/subject/subject.routes';
import { availabilityRoutes } from './modules/availiblity/availiblity.routes';
import { bookingRoutes } from './modules/boooking/booking.routes';
import { adminRoutes } from './modules/admin/admin.routes';
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.all("/api/auth/*splat", toNodeHandler(auth));
app.get('/', (req, res) => {
    res.send('Hello World!');
});
// API Routes
app.use('/profiles', profileRoutes);
app.use('/subject', subjectRoutes);
app.use("/slots", availabilityRoutes);
app.use('/bookings', bookingRoutes);
app.use('/admin', adminRoutes);
// Global Error Handlers and not found middleware
app.use(notFound);
app.use(errorHandler);
export default app;
//# sourceMappingURL=app.js.map