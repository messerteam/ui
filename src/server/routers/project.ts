import API from '~/utils/api';
import { router, publicProcedure } from '../trpc';
import { env } from '~/env.mjs';
import { z } from 'zod';

const api = new API(env.API_URL);

export const projectRouter = router({
    list: publicProcedure
        .input(z.object({
            sort: z.boolean().default(false),
        }))
        .query(async ({ input }) => {
            const { sort } = input;
            
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const projects = await api.getProjects();

            sort && projects.sort((a, b) => Number(b.ctime) - Number(a.ctime));
            return projects;
        })
});