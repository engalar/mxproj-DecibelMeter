import Konva from "konva";
import { Star } from "./Star";

export class SkyBackground {
    stars: Star[] = [];
    constructor(private layer: Konva.Layer) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        // gen star
        for (let i = 0; i < 100; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const radius = Math.random() * 2;
            this.stars.push(new Star(x, y, radius, layer));
        }
        this.animate();
    }
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.layer.batchDraw();
        this.stars.forEach((star) => star.move());
    }
}
