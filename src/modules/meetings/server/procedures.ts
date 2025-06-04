import { db } from "@/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql, } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { TRPCError } from "@trpc/server";
import { meetings } from "@/db/schema";


/**
 * API serveur construite avec tRPC, exposant des fonctions pour lire ou écrire dans la base de données agents, 
 * avec des protections et validations selon les cas.
 */
export const meetingsRouter = createTRPCRouter({
    // si une page n'a pas l'option de,login(par oublie) et qu'un user se rend sur la page via lien
    // protectedProcedure permet de proteger l'API et la page. il ne peut rien creer 

    getOne: protectedProcedure
        .input(z.object({id: z.string()}))
        .query(async ({input, ctx}) => {
        const [existingMeeting] = await db
            .select({
                ...getTableColumns(meetings),
            })
            .from(meetings)
            .where(
                and(
                    eq(meetings.id, input.id),
                    eq(meetings.userId, ctx.auth.user.id),
                )
            );

        if(!existingMeeting) {
            throw new TRPCError({code: "NOT_FOUND", message: "Meeting not found"})
        }
        
        return existingMeeting;
    }),

    
    getMany: protectedProcedure
        .input(z.object({
            //page: z.number().default(DEFAULT_PAGE),
            // Suggestion code rabbit
            page: z.number().min(1).default(DEFAULT_PAGE),
            pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
            search: z.string().nullish()
        }))
        .query(async ({ctx, input}) => {
            const { search, page, pageSize } = input;
            const data = await db
                .select({
                    // TODO: change to actual count
                    meetingCount: sql<number>`5`,
                    ...getTableColumns(meetings),
                })
                .from(meetings)
                .where(
                    and(
                        eq(meetings.userId, ctx.auth.user.id),
                        search ? ilike(meetings.name, `%${search}%`) : undefined
                    )
                )
                .orderBy(desc(meetings.createdAt), desc(meetings.id))
                .limit(pageSize)
                .offset((page -1) * pageSize)

                const [total] = await db.select({count: count()}).from(meetings)
                    .where(
                        and(
                            eq(meetings.userId, ctx.auth.user.id),
                            search ? ilike(meetings.name, `%${search}%`) : undefined
                        )
                    );

                    const totalPages = Math.ceil(total.count / pageSize);

                    return {
                        items: data,
                        total: total.count,
                        totalPages,
                    }
    }),
    
})