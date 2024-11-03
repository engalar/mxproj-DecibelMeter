import Konva from "konva";
export class BaseObject {
    x: number;
    y: number;
    width: number;
    height: number;
    protected layer: Konva.Layer;

    shape: Konva.Shape | undefined;
    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        layer: Konva.Layer,
    ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.layer = layer;
    }
    isCollidingWith(b: BaseObject) {
        if (
            this.shape &&
            b.shape &&
            this.shape.x() < b.shape.x() + b.shape.width() &&
            this.shape.x() + this.shape.width() > b.shape.x() &&
            this.shape.y() < b.shape.y() + b.shape.height() &&
            this.shape.height() + this.shape.y() > b.shape.y()
        ) {
            return true;
        }
        return false;
    }
}
