import Konva from "konva";
import { BaseObject } from "./BaseObject";
export class Plane extends BaseObject {
    image: HTMLImageElement;
    constructor(x: number, y: number, layer: Konva.Layer) {
        super(x, y, 50, 50, layer);
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
