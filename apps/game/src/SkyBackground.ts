import Konva from "konva";
import { Star } from "./Star";
import { ILayout } from "./ILayout";

export class SkyBackground implements ILayout {
    stars: Star[] = [];
    ih: number = 0;
    h: number = 0;
    constructor(private layer: Konva.Layer) {
        this.handleResize = this.handleResize.bind(this);
        this.handleResize();
        this.animate();
        window.addEventListener("resize", this.handleResize);
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
    animate() {
        let lastTime = 0;
        const that = this;
        const doAnimate = (time: number) => {
            const elapsedTime = time - lastTime;
            lastTime = time;
            that.stars.forEach((star) => star.move(elapsedTime));
        };
        this.ih = setInterval(() => {
            cancelAnimationFrame(that.h);
            that.h = requestAnimationFrame((time) => doAnimate(time));
        }, 1000 / 60);
    }
}
