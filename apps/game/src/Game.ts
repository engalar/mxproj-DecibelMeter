import Konva from "konva";
import { interpolateNumber } from "d3-interpolate";
import { timer } from "d3-timer";
import { Bullet } from "./Bullet";
import { Enemy } from "./Enemy";
import { Plane } from "./Plane";
import { SkyBackground } from "./SkyBackground";
import { Wave } from "./Wave";
import { now } from "d3";

const bgSound = new Audio("audio/bg.mp3");
bgSound.autoplay = true;
bgSound.volume = 0.01;
bgSound.loop = true;

function throttle<T extends (...args: any[]) => any>(
    func: T,
    delay: number,
): (...args: Parameters<T>) => void {
    let lastTime = 0;

    return function (...args: Parameters<T>): void {
        const currentTime = now();
        if (currentTime - lastTime >= delay) {
            lastTime = currentTime;
            //@ts-ignore
            func.apply(this, args);
        }
    };
}
export class Game {
    layer: any;
    plane: Plane;
    enemies: Enemy[];
    bullets: Bullet[];
    score: number;
    gameOver: boolean = true;
    bgLayer: Konva.Layer;
    stage: Konva.Stage;
    bg: SkyBackground;
    wave: Wave;
    clientWidth: number = 0;
    clientHeight: number = 0;
    fgLayer: Konva.Layer;
    button: Konva.Rect;
    buttonText: Konva.Text;
    sumTime: number = 0;
    constructor(private container: HTMLDivElement) {
        const stage = new Konva.Stage({
            width: container.clientWidth,
            height: container.clientHeight,
            container,
        });
        this.stage = stage;
        this.layer = new Konva.Layer();
        this.bgLayer = new Konva.Layer();
        this.fgLayer = new Konva.Layer();
        this.bgLayer.zIndex(1);
        this.layer.zIndex(2);
        this.fgLayer.zIndex(3);
        stage.add(this.bgLayer);
        stage.add(this.layer);
        stage.add(this.fgLayer);

        this.plane = new Plane(
            window.innerWidth / 2,
            window.innerHeight,
            this.layer,
        );
        this.enemies = [];
        this.bullets = [];
        this.score = 0;

        this.onResize = this.onResize.bind(this);
        this.shoot = throttle(this.shoot.bind(this), 300);

        this.bg = new SkyBackground(this.bgLayer);
        this.wave = new Wave(0, 0, this.layer, this.shoot);

        this.onResize();
        window.addEventListener("resize", this.onResize);
        window.addEventListener("click", this.shoot);

        const width = this.layer.width();
        const height = this.layer.height();
        // 创建按钮
        this.button = new Konva.Rect({
            x: width / 2 - 100,
            y: height / 2 - 25,
            width: 200,
            height: 50,
            fill: "blue",
            stroke: "black",
            strokeWidth: 4,
            cornerRadius: 10,
            draggable: false,
        });
        // 创建文本
        this.buttonText = new Konva.Text({
            x: width / 2 - 50,
            y: height / 2 - 10,
            text: "Go make it!",
            fontSize: 20,
            fill: "white",
        });
        // 将按钮和文本添加到层中
        this.fgLayer.add(this.button);
        this.fgLayer.add(this.buttonText);
        // 绘制层
        this.fgLayer.draw();
        // 添加点击事件
        this.button.on("click touchstart", () => {
            this.update();
        });
        this.buttonText.on("click touchstart", () => {
            this.update();
        });
    }

    destroy() {
        this.stage.destroy();
        this.bg.destroy();
        window.removeEventListener("resize", this.shoot);
        window.removeEventListener("click", this.shoot);
    }
    onResize() {
        this.clientWidth = this.container.clientWidth;
        this.clientHeight = this.container.clientHeight;

        this.stage.width(this.clientWidth);
        this.stage.height(this.clientHeight);
        this.bg.onLayout(this.clientWidth, this.clientHeight);
        this.plane.onLayout(this.clientWidth, this.clientHeight);
        this.wave.onLayout(this.clientWidth, this.clientHeight);
    }

    // 添加敌机
    addEnemy() {
        const enemy = new Enemy(
            30 + Math.random() * (this.clientWidth - 30 - 30) - 20, // 20 left same as plane do
            -50,
            this.layer,
        );
        this.enemies.push(enemy);
    }

    // 检测碰撞
    checkCollision() {
        this.enemies = this.enemies.filter((enemy) => enemy.shape);
        this.enemies.forEach((enemy) => {
            this.bullets.forEach((bullet) => {
                if (enemy.isCollidingWith(bullet)) {
                    enemy.destroy();
                    bullet.destroy();
                    this.score++;
                    this.buttonText.text(`Score: ${this.score}`);
                    //TODO: display score in canvas
                }
            });
            if (enemy.isCollidingWith(this.plane)) {
                this.gameOver = true;
                console.log(this.score, "分数");
                //TODO: issue here, maybe memory or event overflow
            }
        });
    }

    // 重启游戏
    restart() {
        this.gameOver = false;
        this.score = 0;
        this.enemies.forEach((enemy) => enemy.destroy());
        this.bullets.forEach((bullet) => bullet.destroy());
        this.enemies = [];
        this.bullets = [];
        this.addEnemy();
    }
    moveEnemies(deltaTime: number) {
        for (let i = 0; i < this.enemies.length; i++) {
            const enemy = this.enemies[i];
            enemy.move(deltaTime);
            if (enemy.y > window.innerHeight) {
                this.enemies.splice(i, 1);
                this.layer.remove(enemy.shape);
            }
        }
    }
    shoot() {
        if (this.gameOver) return;
        const bullet = new Bullet(
            this.plane.shape!.x() + this.plane.width / 2,
            this.plane.shape!.y() - 10,
            this.layer,
        );
        this.bullets.push(bullet);
    }
    moveBullets(deltaTime: number) {
        for (let i = 0; i < this.bullets.length; i++) {
            const bullet = this.bullets[i];
            bullet.move(deltaTime);
            if (bullet.y < 0) {
                this.bullets.splice(i, 1);
                bullet.destroy();
            }
        }
    }
    update() {
        this.gameOver = false;
        bgSound.play();
        this._animateWelcome();
        let deltaTime = 0,
            lastTime = 0;
        const h = timer((elapse) => {
            deltaTime = elapse - lastTime;
            lastTime = elapse;
            if (this.gameOver) {
                h.stop();
            } else {
                // random enemy
                if (
                    Math.random() > 0.33 &&
                    (this.sumTime += deltaTime) > 1000
                ) {
                    this.sumTime = 0;
                    this.addEnemy();
                }

                this.moveEnemies(deltaTime);
                this.moveBullets(deltaTime);
                this.plane.onElapse(deltaTime);
                this.wave.onElapse(deltaTime);
                this.bg.onElapse(deltaTime);
                this.checkCollision();
            }
        });
    }
    private _animateWelcome() {
        const duration = 500;

        // 动画生成函数，用于多个属性
        const animateProperties = (
            target: any,
            properties: {
                startValue: number;
                endValue: number;
                setter: (value: number) => void;
            }[],
        ) => {
            return properties.map(({ startValue, endValue, setter }) => {
                const interpolator = interpolateNumber(startValue, endValue);
                return (t: number) => setter(interpolator(t));
            });
        };

        // 动态计算目标 x 坐标的居中位置
        const computeCenteredX = (targetWidth: number) =>
            (this.clientWidth - targetWidth) / 2;

        // 为 this.button 创建动画，包含 x 居中
        const buttonTargetWidth = this.clientWidth * 0.3;
        const buttonTargetHeight = 25;
        const buttonTargetY = buttonTargetHeight / 2;
        const buttonAnimations = animateProperties(this.button, [
            {
                startValue: this.button.x(),
                endValue: computeCenteredX(buttonTargetWidth),
                setter: this.button.x.bind(this.button),
            },
            {
                startValue: this.button.y(),
                endValue: buttonTargetY,
                setter: this.button.y.bind(this.button),
            },
            {
                startValue: this.button.width(),
                endValue: buttonTargetWidth,
                setter: this.button.width.bind(this.button),
            },
            {
                startValue: this.button.height(),
                endValue: buttonTargetHeight,
                setter: this.button.height.bind(this.button),
            },
        ]);

        // 为 this.buttonText 创建动画，包含 x 居中
        const buttonTextTargetWidth = this.clientWidth * 0.3;
        const buttonTextTargetHeight = 25;
        const buttonTextTargetY = buttonTextTargetHeight / 2;
        const buttonTextAnimations = animateProperties(this.buttonText, [
            {
                startValue: this.buttonText.x(),
                endValue: computeCenteredX(buttonTextTargetWidth),
                setter: this.buttonText.x.bind(this.buttonText),
            },
            {
                startValue: this.buttonText.y(),
                endValue: buttonTextTargetY,
                setter: this.buttonText.y.bind(this.buttonText),
            },
            {
                startValue: this.buttonText.width(),
                endValue: buttonTextTargetWidth,
                setter: this.buttonText.width.bind(this.buttonText),
            },
            {
                startValue: this.buttonText.height(),
                endValue: buttonTextTargetHeight,
                setter: this.buttonText.height.bind(this.buttonText),
            },
        ]);

        // 合并所有动画
        const allAnimations = [...buttonAnimations, ...buttonTextAnimations];

        const animationTimer = timer((elapsed) => {
            const t = Math.min(1, elapsed / duration);

            // 执行所有属性动画
            allAnimations.forEach((animate) => animate(t));

            if (t >= 1) {
                animationTimer.stop();
            }
        });
    }
}
