import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { prisma } from "$lib/server/prisma"

// RequestHandle to get a single image by id
export const GET: RequestHandler = async ({params, setHeaders}) => {
    const id = params.id;
    const image = await prisma.image.findUnique({
        where: { id: parseInt(id) }
    });
    if (!image) {
        return error(404, 'Not found');
    }

    setHeaders({
        'Content-Type': image.imageType,
        'Content-Length': image.imageSize.toString(),
        'Last-Modified': new Date(image.lastUpdate.toString()).toUTCString(),
        'Cache-Control': 'public, max-age=600', 
    });

    const responseImage = new Blob([image.imageData], {type: image.imageType})

    return new Response(responseImage)
    
}