import { ByteBuffer } from "../../model/ByteBuffer";

interface ISpritePixel {
    x: number;
    y: number;

    r: number;
    g: number;
    b: number;
    a: number;
}

export class SPRFile {
    /**
     * The file version / revision.
     */
    public fileVersion: number;

    /**
     * The file sprite count.
     */
    public spriteCount: number;

    constructor(
        private buffer: ByteBuffer,
        private opts?: {
            transparent: boolean;
        }
    ) {
        this.fileVersion = this.buffer.readUInt();
        this.spriteCount = this.buffer.readUInt();
    }

    /**
     * Loads a single sprite.
     * @param id The sprite ID.
     * @returns 
     */
    public readSprite(id: number) {
        // The sprite offset address is the ID times the size of a int
        //const spriteIndexOffset = 4 * id;
        const position = (
            ((id - 1) * 4) + 8
        );

        this.buffer.seek(position);

        const startingAddress =  this.buffer.readUInt();

        // Skip to the starting address
        this.buffer.seek(startingAddress);

        // Skip R + G + B unused values
        this.buffer.readUByte();
        this.buffer.readUByte();
        this.buffer.readUByte();

        const length = this.buffer.readUShort();
        const end = startingAddress + length;

        const pixels: ISpritePixel[] = [];

        let pixelCounter = 0;

        while (this.buffer.offset < end) {
            const transparentPixels = this.buffer.readUShort();
            const coloredPixels = this.buffer.readUShort();

            pixelCounter += transparentPixels;

            for (let i = 0; i < coloredPixels; i++, pixelCounter++) {
                pixels.push({
                    x: Math.round(pixelCounter % 32),
                    y: Math.round(pixelCounter / 32),

                    r: this.buffer.readUByte() & 0xff,
                    g: this.buffer.readUByte() & 0xff,
                    b: this.buffer.readUByte() & 0xff,
                    a: this.opts?.transparent ? this.buffer.readUByte() & 0xff : 255
                });
            }
        }

        return pixels;
    }
}