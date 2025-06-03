import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema } from "../schema";
import z from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql, } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";


/**
 * API serveur construite avec tRPC, exposant des fonctions pour lire ou écrire dans la base de données agents, 
 * avec des protections et validations selon les cas.
 */
export const agentsRouter = createTRPCRouter({
    // si une page n'a pas l'option de,login(par oublie) et qu'un user se rend sur la page via lien
    // protectedProcedure permet de proteger l'API et la page. il ne peut rien creer 
    getOne: protectedProcedure.input(z.object({id: z.string()})).query(async ({input,}) => {
        const [existingAgent] = await db
            .select({
                // TODO: change to actual count
                meetingCount: sql<number>`5`,
                ...getTableColumns(agents),
            })
            .from(agents)
            .where(eq(agents.id, input.id));
        
        return existingAgent;
    }),
    getMany: protectedProcedure
        .input(z.object({
            page: z.number().default(DEFAULT_PAGE),
            pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
            search: z.string().nullish()
        }))
        .query(async ({ctx, input}) => {
            const { search, page, pageSize } = input;
            const data = await db
                .select({
                    // TODO: change to actual count
                    meetingCount: sql<number>`5`,
                    ...getTableColumns(agents),
                })
                .from(agents)
                .where(
                    and(
                        eq(agents.userId, ctx.auth.user.id),
                        search ? ilike(agents.name, `%${search}%`) : undefined
                    )
                )
                .orderBy(desc(agents.createdAt), desc(agents.id))
                .limit(pageSize)
                .offset((page -1) * pageSize)

                const [total] = await db.select({count: count()}).from(agents)
                    .where(
                        and(
                            eq(agents.userId, ctx.auth.user.id),
                            search ? ilike(agents.name, `%${search}%`) : undefined
                        )
                    );

                    const totalPages = Math.ceil(total.count / pageSize);

                    return {
                        items: data,
                        total: total.count,
                        totalPages,
                    }
    }),
    
    /**
     * protectedProcedure: to verify if user is login
     * agentsInsertSchem: to verifiy if all field is complete
     */
    create: protectedProcedure
    .input(agentsInsertSchema) 
    .mutation(async ({input, ctx}) => {
    const [createdAgent] = await db
        .insert(agents)
        .values({...input, userId: ctx.auth.user.id})
        .returning();

    return createdAgent;

    })
})