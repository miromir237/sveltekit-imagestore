import type { Actions, PageServerLoad } from "./$types";
import { prisma } from "$lib/server/prisma"
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => { 
    const page = parseInt(params.page) || 1
    const limit = 6
    const offset = (page - 1) * limit
    // async function to get images
    const getImages = async () => {
        return await prisma.image.findMany({
            select: {
                id: true,
                name: true,
            },
            skip: offset,
            take: limit
        })
    }
    // async function to get total images
    const getTotalImages = async () => {
        return await prisma.image.count()
    }
    // get images and total images
    const [images, totalImages] = await Promise.all([getImages(), getTotalImages()])
    // return images and total images
    return {
        images,
        totalImages,
        page
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