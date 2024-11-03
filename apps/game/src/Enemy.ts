import Konva from "konva";
import { BaseObject } from "./BaseObject";

export class Enemy extends BaseObject {
    destroy() {
        //TODO: play explosion sound and image
        this.shape?.destroy();
        this.shape = undefined;
    }
    isOutOfScreen() {
        if (this.y > window.innerHeight) {
            return true;
        }
        return false;
    }
    image: HTMLImageElement;
    constructor(x: number, y: number, layer: Konva.Layer) {
        super(x, y, 50, 50, layer);

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
    move(deltaTime: number) {
        //TODO: x movement
        this.y += (26 * deltaTime) / 1000;
        this.shape?.y(this.y);
        this.layer.draw();
    }
}
