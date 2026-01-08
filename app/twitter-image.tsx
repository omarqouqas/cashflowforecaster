import OpenGraphImage, { contentType, size } from './opengraph-image';

// Must be a string literal in this file or Next won't recognize it.
export const runtime = 'edge';

export { contentType, size };
export default OpenGraphImage;

