import Konva from "konva";
import { Star } from "./Star";

export class SkyBackground {
    stars: Star[] = [];
    constructor(private layer: Konva.Layer) {
        this.handleResize();
        this.animate();
        window.addEventListener("resize", this.handleResize);
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
        const doAnimate = (elapsedTime: number) => {
            this.layer.batchDraw();
            this.stars.forEach((star) => star.move(elapsedTime));
        };
        let h: number;
        let lastTime = 0;
        setInterval(() => {
            cancelAnimationFrame(h);
            const now = performance.now();
            const elapsedTime = now - lastTime;
            lastTime = now;
            h = requestAnimationFrame(() => doAnimate(elapsedTime));
        }, 1000 / 60);
    }
}
