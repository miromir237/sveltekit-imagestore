import type { Actions, PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma"
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {       
    return {
        images: await prisma.image.findMany({
            select: {
                id: true,
                name: true,
            }
        })
    }
};

// SvelteKit delete image Action
export const actions: Actions = {
    deleteImage: async ({ url }) => {
        const id = url.searchParams.get("id")

        if (!id) {
            return fail(400, { message: 'ID is required.'})
        }

        try {
            await prisma.image.delete({
                where: {
                    id: parseInt(id)
                }
            })
        } catch (err) {
            console.error(err)
            return fail(500, { message: 'Failed to delete Image.'})
        }
    }
}