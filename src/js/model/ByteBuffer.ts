export class ByteBuffer {
    /**
     * The data view used to read data.
     */
    private view: DataView;

    /**
     * The current offset.
     */
    public offset = 0;

    constructor(data: DataView) {
        this.view = data;
    }

    /**
     * Reads a single unsigned byte.
     * @returns 
     */
    readUByte() {
        const value = this.view.getUint8(this.offset);

        this.offset++;

        return value;
    }

    /**
     * Reads a single unsigned short.
     * @returns 
     */
    readUShort() {
        const value = this.view.getUint16(this.offset, true);

        this.offset += 2;

        return value;
    }

    /**
     * Reads a single unsigned int.
     * @returns 
     */
    readUInt() {
        const value = this.view.getUint32(this.offset, true);

        this.offset += 4;

        return value;
    }

    /**
     * Seeks the current position to a new offset.
     * @param offset The offset to seek to.
     */
    seek(offset: number) {
        this.offset = offset;
    }

    /**
     * Skips a given number of bytes.
     * @param bytes The number of bytes to skip.
     */
    skip(bytes: number) {
        this.offset += bytes;
    }
}