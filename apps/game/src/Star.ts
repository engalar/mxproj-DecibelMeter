import Konva from "konva";
export class Star {
    x: number;
    y: number;
    radius: number;
    star: Konva.Circle;
    constructor(x: number, y: number, radius: number, layer: Konva.Layer) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.star = new Konva.Circle({
            x: x,
            y: y,
            radius: radius,
            fill: "white",
        });
        layer.add(this.star);
    }
    destroy() {
        this.star.destroy();
    }
    move(elapsedTime: any) {
        this.y += (53 * elapsedTime) / 1000; // 星星向下移动
        this.star.y(this.y);
        if (this.y > window.innerHeight) {
            this.y = -this.radius;
        }
    }
}