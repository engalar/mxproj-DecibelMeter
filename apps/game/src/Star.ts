import Konva from "konva";
export class Star {
    x: number;
    y: number;
    star: Konva.Circle;
    private _maxRadius: number;
    constructor(x: number, y: number, radius: number, layer: Konva.Layer) {
        this.x = x;
        this.y = y;
        this._maxRadius = radius + 5 * Math.random();
        this.star = new Konva.Circle({
            x: x,
            y: y,
            radius: this._maxRadius * Math.random(),
            fill: "white",
        });
        layer.add(this.star);
    }
    destroy() {
        this.star.destroy();
    }
    move(elapsedTime: any) {
        if (this.star.radius() < this._maxRadius) {
            this.star.radius(
                this.star.radius() + (this._maxRadius * elapsedTime) / 1000,
            );
        } else {
            this.star.radius(0);
            this.star.x(window.innerWidth * Math.random());
            this.star.y(window.innerHeight * Math.random());
        }
        this.y += (53 * elapsedTime) / 1000; // 星星向下移动
        this.star.y(this.y);
        if (this.y > window.innerHeight) {
            this.y = -this._maxRadius;
        }
    }
}
