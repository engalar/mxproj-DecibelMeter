import Konva from "konva";
import { BaseObject } from "./BaseObject";
import { executer } from "./util";
import { ILayout } from "./ILayout";
import { IElapse } from "./IElapse";
export class Plane extends BaseObject implements ILayout, IElapse {
    image: HTMLImageElement;
    excuter?: (elapsedTime: number) => number;
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
    onElapse(elapse: number): void {
        if (this.excuter) {
            const newX = this.excuter(elapse);
            this.shape?.x(newX);
        }
    }
    onLayout(width: number, _height: number): void {
        this.excuter = executer(0 + 50, width - 50 * 2, 2000, width / 2);
    }
}
