import Konva from "konva";
import { Star } from "./Star";
import { ILayout } from "./ILayout";
import { IElapse } from "./IElapse";

export class SkyBackground implements ILayout, IElapse {
    stars: Star[] = [];
    ih: number = 0;
    h: number = 0;
    constructor(private layer: Konva.Layer) {
        this.handleResize = this.handleResize.bind(this);
        this.handleResize();
        window.addEventListener("resize", this.handleResize);
    }
    onElapse(elapse: number): void {
        this.stars.forEach((star) => star.move(elapse));
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
        window.removeEventListener("resize", this.handleResize);
        this.stars.forEach((star) => {
            star.destroy();
        });
        this.stars = [];
        clearInterval(this.ih);
        cancelAnimationFrame(this.h);
    }
    handleResize = () => {
        this.stars.forEach((star) => {
            star.destroy();
        });
        this.stars = [];
        const width = window.innerWidth;
        const height = window.innerHeight;
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const radius = Math.random() * 2;
            this.stars.push(new Star(x, y, radius, this.layer));
        }
    };
}
