import { router } from '../trpc';
import { projectRouter } from './project';

export const appRouter = router({
    project: projectRouter,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;