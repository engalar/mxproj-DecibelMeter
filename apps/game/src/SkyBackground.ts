import Konva from "konva";
import { Star } from "./Star";
import { ILayout } from "./ILayout";
import { IElapse } from "./IElapse";

export class SkyBackground implements ILayout, IElapse {
    stars: Star[] = [];
    constructor(private layer: Konva.Layer) {}
    onElapse(elapse: number): void {
        if (elapse < 1000 / 60) this.stars.forEach((star) => star.move(elapse));
    }
    onLayout(width: number, height: number): void {
        this.stars.forEach((star) => {
            star.destroy();
        });
        this.stars = [];
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const radius = Math.random() * 2;
            this.stars.push(new Star(x, y, radius, this.layer));
        }
    }
    destroy() {
        this.stars.forEach((star) => {
            star.destroy();
        });
        this.stars = [];
    }
}
