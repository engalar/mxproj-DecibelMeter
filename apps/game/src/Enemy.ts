import Konva from "konva";

export class Enemy {
    x: number;
    y: number;
    width: number;
    height: number;
    image: HTMLImageElement;
    shape: Konva.Image | undefined;
    constructor(
        x: number,
        y: number,
        private layer: Konva.Layer,
    ) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.image = new Image();
        this.image.src = "img/enemy.png";
        this.image.onload = () => {
            this.shape = new Konva.Image({
                x: this.x,
                y: this.y,
                image: this.image,
                width: this.width,
                height: this.height,
            });
            layer.add(this.shape);
            layer.draw();
        };
    }
    move() {
        this.y += 5;
        this.shape?.y(this.y);
        this.layer.draw();
    }
}
