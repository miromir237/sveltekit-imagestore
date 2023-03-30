import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { prisma } from "$lib/server/prisma"
import sharp from 'sharp';

// RequestHandle to get a single image by id
export const GET: RequestHandler = async ({params, setHeaders}) => {
    const id = params.id;
    const width = 320;
    const height = 240;

    const image = await prisma.image.findUnique({
        where: { id: parseInt(id) }
    });
    if (!image) {
        return error(404, 'Not found');
    }

    // Resize the image and get the buffer and info
    const resizedImageInfo = await sharp(image.imageData).resize(width, height).toBuffer({ resolveWithObject: true });

    // Setting the headers
    setHeaders({
        'Content-Type': resizedImageInfo.info.format,
        'Content-Length': resizedImageInfo.info.size.toString(),
        'Last-Modified': new Date(image.lastUpdate.toString()).toUTCString(),
        'Cache-Control': 'public, max-age=600', 
    });

    const responseImage = new Blob([resizedImageInfo.data], {type: resizedImageInfo.info.format})

    return new Response(responseImage);
    
}