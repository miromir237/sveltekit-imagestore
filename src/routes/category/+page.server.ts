import type { Actions, PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma"
import { fail } from '@sveltejs/kit';
import { z } from 'zod';
import { superValidate } from 'sveltekit-superforms/server'

const schema = z.object({
    name: z.string().min(3).max(16)
})

export const load: PageServerLoad = async (event) => {    
    const form = await superValidate(event, schema)

    return {
        form,
        categories: await prisma.category.findMany()
    }
};

export const actions = {
    createCategory: async (event) => {
        const form = await superValidate(event, schema)
        
        if (!form.valid) {
            return fail(400, { 
                form 
            })
        }

        try {
            await prisma.category.create({
                data: {
                    name: form.data.name
                }
            })
        } catch (err) {
            console.log(err)
            return fail(500, { 
                message: 'Failed to create category.',
                form 
            })
        }
        

        return { form }
    }
}
