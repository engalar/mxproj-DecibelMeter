import Konva from "konva";
export class Bullet {
    x: number;
    y: number;
    width: number;
    height: number;
    shape: Konva.Rect | undefined;
    constructor(
        x: number,
        y: number,
        private layer: Konva.Layer,
    ) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = 10;
        this.shape = new Konva.Rect({
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            fill: "red",
        });
        layer.add(this.shape);
        layer.draw();
    }
    move() {
        this.y -= 10;
        this.shape?.y(this.y);
        this.layer.draw();
    }
}
