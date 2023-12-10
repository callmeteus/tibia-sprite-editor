import { FilesState } from "../../core/states/FilesState";

export class Sprite {
    /**
     * The canvas context used to render sprites.
     */
    private static context: CanvasRenderingContext2D;

    /**
     * The rendered sprite's PNG data URL.
     */
    private png: string;

    public static getContext() {
        if (!this.context) {
            const canvas = document.createElement("canvas");

            canvas.width = 32;
            canvas.height = 32;

            this.context = canvas.getContext("2d");
        }

        return this.context;
    }

    constructor(
        /**
         * The sprite ID.
         */
        public id: number
    ) {
        
    }

    /**
     * Reads the pixels for the sprite.
     * @returns 
     */
    public getPixels() {
        return FilesState.spr.readSprite(this.id);
    }

    /**
     * Renders the selected sprite to PNG.
     * @returns
     */
    public renderToPNG() {
        if (!this.png) {
            const pixels = this.getPixels();

            Sprite.getContext().clearRect(0, 0, 1200, 1200);

            for (const pixel of pixels) {
                Sprite.getContext().fillStyle = `rgba(${pixel.r}, ${pixel.g}, ${pixel.b}, ${pixel.a})`;
                Sprite.getContext().fillRect(pixel.x, pixel.y, 1, 1);
            }

            this.png = Sprite.getContext().canvas.toDataURL("image/png");
        }

        return this.png;
    }
}