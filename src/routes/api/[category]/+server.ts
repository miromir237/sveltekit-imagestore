import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { prisma } from "$lib/server/prisma"
import sharp from 'sharp';

// RequestHandle to get a single image by category
export const GET: RequestHandler = async ({params, setHeaders}) => {
    
    const width = 320;
    const height = 240;

    // Get the categories
    const categories = await prisma.category.findMany({
        select: {
            id: true,
            name: true
        }
    });
    if (!categories) {
        return error(404, 'Category Not found');
    }

    // Get category id from name
    const categoryId = categories.find(category => category.name === params.category)?.id;
    if (!categoryId) {
        return error(404, 'Category Not found');
    }
    

    const imageIds = await prisma.image.findMany({
        where: {
            categoryId: categoryId,
        },
        select: {
            id: true,
        }
    });
    if (!imageIds) {
        return error(404, 'No images found in category ' + params.category);
    }

    // Get a random image
    const image = await prisma.image.findMany({
        where: {
            id: imageIds[Math.floor(Math.random() * imageIds.length)].id,
        }
    });

    
    // Resize the image and get the buffer and info
    const resizedImageInfo = await sharp(image[0].imageData).resize(width, height).toBuffer({ resolveWithObject: true });

    // Setting the headers
    setHeaders({
        'Content-Type': resizedImageInfo.info.format,
        'Content-Length': resizedImageInfo.info.size.toString(),
        'Last-Modified': new Date(image[0].lastUpdate.toString()).toUTCString(),
        'Cache-Control': 'public, max-age=600', 
    });

    const responseImage = new Blob([resizedImageInfo.data], {type: resizedImageInfo.info.format})

    return new Response(responseImage);
    
}