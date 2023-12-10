<template>
    <div class="w-screen h-screen p-5">
        <div class="flex justify-around w-full h-full">
            <div>
                <h3 class="text-3xl font-medium mb-5">
                    Tibia Sprite Editor
                </h3>

                <input
                    class="border p-3 rounded block mt-3 bg-white text-black"
                    type="file"
        
                    @change="onSelectSPRFile"
                />

                <canvas
                    ref="canvas"

                    class="mt-5"

                    width="32"
                    height="32"
                />
            </div>

            <div class="w-1/2 text-right h-full">
                <div class="overflow-y-auto gap-3 flex flex-wrap h-full">
                    <div
                        v-for="sprite, index in sprites"
                        :key="'sprite-' + index"

                        class="transition border rounded-md bg-white cursor-pointer hover:bg-pink-500 w-full flex items-center justify-center p-3"

                        :class="{
                            'bg-pink-600': selectedSpriteId === sprite.id
                        }"

                        @click="loadSprite(sprite.id)"
                    >
                        <img
                            :src="sprite.renderToPNG()"

                            width="32"
                            height="32"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { SPRFile } from "../core/file-formats/SPRFile";
import { ByteBuffer } from "../model/ByteBuffer";
import { Sprite } from "../model/game/Sprite";

export default {
    data() {
        return {
            selectedSpriteId: 1,
            hasFile: false,

            currentPage: 1,
            perPage: 20,

            sprites: [] as Sprite[]
        }
    },

    computed: {
        ctx() {
            return (this.$refs.canvas as HTMLCanvasElement).getContext("2d");
        },

        rendererCtx() {
            return (this.$refs.renderer as HTMLCanvasElement).getContext("2d");
        },

        pageCount() {
            return (Math.ceil(this.$files.spr?.spriteCount) * this.perPage) || 1;
        }
    },

    watch: {
        currentPage() {
            this.loadSelectedPage();
        }
    },

    methods: {
        setPage(page: number) {
            this.currentPage = page;
        },

        loadSelectedPage() {
            // Clear existing sprites
            while(this.sprites.length) {
                this.sprites.pop();
            }

            for (let i = 1; i < this.perPage; i++) {
                const spriteIndex = this.currentPage * i;

                if (spriteIndex > this.$files.spr.spriteCount) {
                    break;
                }

                this.sprites.push(
                    new Sprite(spriteIndex)
                );
            }

            this.renderSelectedSprite();
        },

        /**
         * Opens the SPR file.
         */
        onSelectSPRFile(e: InputEvent) {
            this.$nextTick(() => {
                const reader = new FileReader();

                reader.addEventListener("load", () => {
                    const { result } = reader;

                    const file = new DataView(result as ArrayBuffer);
                    const buff = new ByteBuffer(file);

                    this.$files.spr = new SPRFile(buff);

                    this.setPage(1);
                    this.loadSelectedPage();

                    this.hasFile = true;
                });

                reader.readAsArrayBuffer((e.target! as HTMLInputElement).files![0]);
            });
        },

        loadSprite(index: number) {
            this.selectedSpriteId = index;
            this.renderSelectedSprite();
        },

        /**
         * Renders the selected sprite
         */
        renderSelectedSprite() {
            const pixels = this.$files.spr.readSprite(this.selectedSpriteId);

            this.ctx.clearRect(0, 0, 1200, 1200);

            for (const pixel of pixels) {
                this.ctx.fillStyle = `rgba(${pixel.r}, ${pixel.g}, ${pixel.b}, ${pixel.a})`;
                this.ctx.fillRect(pixel.x, pixel.y, 1, 1);
            }
        }
    }
}
</script>