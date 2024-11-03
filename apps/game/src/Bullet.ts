import Konva from "konva";
import { BaseObject } from "./BaseObject";
// load ./audio/shoot.mp3
const shootSound = new Audio("audio/shoot.mp3");
export class Bullet extends BaseObject {
    destroy() {
        this.shape?.destroy();
        this.shape = undefined;
        console.log("子弹销毁");
    }
    isOutOfScreen() {
        if (this.y < 0) {
            return true;
        }
        return false;
    }
    constructor(x: number, y: number, layer: Konva.Layer) {
        super(x, y, 5, 8, layer);
        this.shape = new Konva.Rect({
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            fill: "red",
        });
        layer.add(this.shape);

        shootSound.currentTime = 0;
        shootSound.play();
    }
    move(deltaTime: number) {
        this.y -= (350 * deltaTime) / 1000;
        this.shape?.y(this.y);
    }
}
