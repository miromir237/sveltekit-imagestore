import type { Actions, PageServerLoad } from './$types';
import { prisma } from "$lib/server/prisma"
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {    
    return {
        categories: await prisma.category.findMany()
    }
};

export const actions: Actions = {
    default: async (event) => {
        
        // Read the file from the request
        const data = await event.request.formData()
        const file = data.get('filename')?.valueOf() as File;
        const catId = data.get('catId')?.valueOf() as string;
        
        // Convert catId to Integer number
        const catIdNum = parseInt(catId)
        

        // Convert image to Prisma Bytes type
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
     
        // Create the image in the database
        try {
            await prisma.image.create({
                data: {
                    name: file.name,
                    imageType: file.type,
                    imageSize: file.size,
                    lastUpdate: file.lastModified,
                    imageData: buffer,
                    category: { connect: { id: catIdNum } }
                }
            })
        } catch (err) {
            console.log(err)
            return fail(500, { 
                message: 'Failed to create image.', 
            })
        }
    }
}