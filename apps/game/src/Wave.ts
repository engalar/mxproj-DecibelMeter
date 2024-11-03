import Konva from "konva";
import { BaseObject } from "./BaseObject";
import { ILayout } from "./ILayout";
import { IElapse } from "./IElapse";

const settings = {
    bars: 50,
    width: 1,
    height: 30,
    spacing: 2,
};

export class Wave extends BaseObject implements ILayout, IElapse {
    lastVolume: number = 0;
    bars: Konva.Rect[] = [];
    volumes: number[] = new Array(settings.bars);
    constructor(x: number, y: number, layer: Konva.Layer, cb: Function) {
        super(x, y, 0, 0, layer);
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
                const audioContext = new AudioContext();
                const analyser = audioContext.createAnalyser();
                const source = audioContext.createMediaStreamSource(stream);
                const javascriptNode = audioContext.createScriptProcessor(
                    2048,
                    1,
                    1,
                );
                analyser.smoothingTimeConstant = 0.4;
                analyser.fftSize = 1024;
                source.connect(analyser);
                analyser.connect(javascriptNode);
                javascriptNode.connect(audioContext.destination);
                javascriptNode.onaudioprocess = () => {
                    var array = new Uint8Array(analyser.frequencyBinCount);
                    analyser.getByteFrequencyData(array);
                    var values = 0;
                    var length = array.length;
                    for (var i = 0; i < length; i++) {
                        values += array[i];
                    }
                    this.lastVolume = values / length;
                    if (this.lastVolume > 28) {
                        cb();
                    }
                };
            })
            .catch(function (err) {
                console.error(err);
            });
    }
    onElapse(_elapse: number): void {
        this.volumes.unshift(this.lastVolume);
        this.volumes.pop();
        //loop this.bars
        for (let i = 0; i < this.bars.length; i++) {
            const bar = this.bars[i];
            const volume = this.volumes[i];

            const _height = Math.sin((i / settings.bars) * 3) * settings.height;
            if (_height > 0 && volume > 0) {
                // 计算 y 坐标，确保在 0 到 containerHeight 之间
                const y =
                    this.layer.height() - settings.height / 2 - _height / 2;
                bar.y(y);
                bar.height((_height * volume) / 40);
            }
        }
    }
    onLayout(width: number, height: number): void {
        // dispose previous bars
        this.bars.forEach((bar) => {
            bar.destroy();
        });
        this.bars = [];

        const totalSpacing = settings.spacing * (settings.bars - 1);
        const totalBarWidth = settings.width * settings.bars;
        const totalWidth = totalBarWidth + totalSpacing;

        const scaleFactor = width / totalWidth;

        for (let i = 0; i < settings.bars; i++) {
            const _height = Math.sin((i / settings.bars) * 3) * settings.height;
            if (_height > 0) {
                // 计算 x 坐标，确保在 0 到 containerWidth 之间
                const x =
                    (i * (settings.width + settings.spacing) -
                        settings.spacing) *
                    scaleFactor;

                // y 坐标仍然是从容器底部绘制
                const y = height - settings.height / 2 - _height / 2;

                const rect = new Konva.Rect({
                    x: x,
                    y: y,
                    width: settings.width * scaleFactor, // 适应比例
                    height: _height,
                    fill: "lightblue",
                    cornerRadius: Math.max(
                        2,
                        (settings.width * scaleFactor) / 2,
                    ), // 确保圆角半径为非负
                });

                this.layer.add(rect);
                this.bars.push(rect);
            }
        }
    }
}
