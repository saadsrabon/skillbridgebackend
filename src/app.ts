import express, { Application } from 'express'
const app:Application = express()
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './lib/auth';
import { notFound } from './middlewares/notfound';
import errorHandler from './middlewares/globalErrorhandlers';
import { profileRoutes } from './modules/profile/profile.routes';
app.use(cors({
    origin: '*',
    credentials: true
}))
app.use(express.json())
app.all("/api/auth/*splat", toNodeHandler(auth));
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Profile Routes

app.use('/auth', profileRoutes);


// Global Error Handlers and not found middleware
app.use(notFound)
app.use(errorHandler)

export default app;