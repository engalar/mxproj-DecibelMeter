import Konva from "konva";
export class Plane {
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
        this.image.src = "img/plane.png";
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
    moveLeft() {
        this.x -= 10;
        this.shape?.x(this.x);
        this.layer.draw();
    }
    moveRight() {
        this.x += 10;
        this.shape?.x(this.x);
        this.layer.draw();
    }
    moveUp() {
        this.y -= 10;
        this.shape?.y(this.y);
        this.layer.draw();
    }
    moveDown() {
        this.y += 10;
        this.shape?.y(this.y);
        this.layer.draw();
    }
}
