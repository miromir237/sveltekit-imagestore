import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { prisma } from "$lib/server/prisma"
import sharp from 'sharp';

export const GET: RequestHandler = async ({params, setHeaders}) => {
    const width = params.width;
    const height = params.height;
    

    // Getting all image ids
    const imageIds = await prisma.image.findMany({
        select: {
            id: true,
        }
    });

    // Picking a random image id
    const randomId = imageIds[Math.floor(Math.random() * imageIds.length)].id
    
    // Getting the image
    const image = await prisma.image.findUnique({
        where: { id: randomId }
    });
    if (!image) {
        return error(404, 'Not found');
    }

    // Resize the image and get the buffer and info
    const resizedImageInfo = await sharp(image.imageData).resize(parseInt(width), parseInt(height)).toBuffer({ resolveWithObject: true });

    // Setting the headers
    setHeaders({
        'Content-Type': resizedImageInfo.info.format,
        'Content-Length': resizedImageInfo.info.size.toString(),
        'Last-Modified': new Date(image.lastUpdate.toString()).toUTCString(),
        'Cache-Control': 'public, max-age=600', 
    });

    const responseImage = new Blob([resizedImageInfo.data], {type: resizedImageInfo.info.format})

    return new Response(responseImage);
};