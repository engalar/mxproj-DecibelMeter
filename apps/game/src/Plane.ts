import Konva from "konva";
import { BaseObject } from "./BaseObject";
import { executer } from "./util";
import { ILayout } from "./ILayout";
import { IElapse } from "./IElapse";
const image = new Image();
image.src = "img/plane.png";
export class Plane extends BaseObject implements ILayout, IElapse {
    excuter?: (elapsedTime: number) => number;
    constructor(x: number, y: number, layer: Konva.Layer) {
        super(x, y, 25, 35, layer);
    }
    onElapse(elapse: number): void {
        if (this.excuter) {
            const newX = this.excuter(elapse);
            this.shape?.x(newX);
        }
    }
    onLayout(width: number, height: number): void {
        if (!this.shape) {
            this.shape = new Konva.Image({
                x: width / 2 - this.width / 2,
                y: height - this.height - 30,
                image,
                width: this.width,
                height: this.height,
            });
            this.layer.add(this.shape);
        } else {
            this.shape.x(width / 2 - this.width / 2);
            this.shape.y(height - this.height - 50);
        }
        this.excuter = executer(0, width - 20, 3000, width / 2);
    }
}
