import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema } from "../schema";
import z from "zod";
import { eq } from "drizzle-orm";


/**
 * API serveur construite avec tRPC, exposant des fonctions pour lire ou écrire dans la base de données agents, 
 * avec des protections et validations selon les cas.
 */
export const agentsRouter = createTRPCRouter({
    // si une page n'a pas l'option de,login(par oublie) et qu'un user se rend sur la page via lien
    // protectedProcedure permet de proteger l'API et la page. il ne peut rien creer 
    getOne: protectedProcedure.input(z.object({id: z.string()})).query(async ({input}) => {
        const [existingAgent] = await db.select().from(agents).where(eq(agents.id, input.id));
        
        return existingAgent;
    }),
    getMany: protectedProcedure.query(async () => {
        const data = await db.select().from(agents);
        
        return data;
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