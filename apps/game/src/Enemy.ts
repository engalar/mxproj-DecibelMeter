import Konva from "konva";
import { BaseObject } from "./BaseObject";

const sound = new Audio("audio/bullet.mp3");
sound.volume = 0.1;
const image1 = new Image();
image1.src = "img/enemy.png";
const image2 = new Image();
image2.src = "img/boom.png";
export class Enemy extends BaseObject {
    destroy() {
        this.shape?.destroy();
        this.shape = undefined;
        const shape = new Konva.Image({
            x: this.x,
            y: this.y,
            image: image2,
            width: this.width,
            height: this.height,
        });
        this.layer.add(shape);

        // remove shape after 500ms
        setTimeout(() => {
            shape.destroy();
        }, 200);

        sound.currentTime = 0.7;
        sound.play();
    }
    constructor(x: number, y: number, layer: Konva.Layer) {
        super(x, y, 50, 50, layer);

        this.shape = new Konva.Image({
            x: this.x,
            y: this.y,
            image: image1,
            width: this.width,
            height: this.height,
        });
        layer.add(this.shape);
        layer.draw();
    }
    move(deltaTime: number) {
        this.y += (26 * deltaTime) / 1000;
        this.shape?.y(this.y);
    }
}
