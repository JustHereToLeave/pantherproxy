// This file configures the Ultraviolet client.
// It should be placed in the root of your project.

self.__uv$config = {
    prefix: '/uv/service/',
    // This is the crucial part that tells the proxy where to send its traffic.
    bare: '/bare/', 
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/uv/uv.handler.js',
    bundle: '/uv/uv.bundle.js',
    config: '/uv.config.js',
    sw: '/uv/uv.sw.js',
};
