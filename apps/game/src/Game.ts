import Konva from "konva";
import { Bullet } from "./Bullet";
import { Enemy } from "./Enemy";
import { Plane } from "./Plane";
import { SkyBackground } from "./SkyBackground";
import { Wave } from "./Wave";

const bgSound = new Audio("audio/bg.mp3");
bgSound.autoplay = true;
bgSound.loop = true;

function throttle<T extends (...args: any[]) => any>(
    func: T,
    delay: number,
): (...args: Parameters<T>) => void {
    let lastTime = 0;

    return function (...args: Parameters<T>): void {
        const currentTime = Date.now();
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
    gameOver: boolean;
    bgLayer: Konva.Layer;
    stage: Konva.Stage;
    bg: SkyBackground;
    wave: Wave;
    clientWidth: number = 0;
    clientHeight: number = 0;
    constructor(private container: HTMLDivElement) {
        const stage = new Konva.Stage({
            width: container.clientWidth,
            height: container.clientHeight,
            container,
        });
        this.stage = stage;
        this.layer = new Konva.Layer();
        this.bgLayer = new Konva.Layer();
        stage.add(this.bgLayer);
        stage.add(this.layer);

        this.plane = new Plane(
            window.innerWidth / 2,
            window.innerHeight,
            this.layer,
        );
        this.enemies = [];
        this.bullets = [];
        this.score = 0;
        this.gameOver = false;

        this.onResize = this.onResize.bind(this);
        this.shoot = throttle(this.shoot.bind(this), 300);

        this.bg = new SkyBackground(this.bgLayer);
        this.wave = new Wave(0, 0, this.layer, this.shoot);

        this.onResize();
        window.addEventListener("resize", this.onResize);
        window.addEventListener("click", this.shoot);

        this.renderWelcome();
    }
    renderWelcome() {
        const width = this.layer.width();
        const height = this.layer.height();
        // 创建按钮
        var button = new Konva.Rect({
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
        var buttonText = new Konva.Text({
            x: width / 2 - 50,
            y: height / 2 - 10,
            text: "Go make it!",
            fontSize: 20,
            fill: "white",
        });
        // 将按钮和文本添加到层中
        this.layer.add(button);
        this.layer.add(buttonText);
        // 绘制层
        this.layer.draw();
        // 添加点击事件
        button.on("click touchstart", () => {
            button.destroy();
            buttonText.destroy();
            this.update();
        });
        buttonText.on("click touchstart", () => {
            this.update();
            buttonText.destroy();
            button.destroy();
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
        bgSound.play();
        setInterval(() => {
            if (!this.gameOver) {
                cancelAnimationFrame(this.h);
                this.h = requestAnimationFrame((time) =>
                    this.doUpdate.call(this, time),
                );
            }
        }, 1000 / 60);
    }
    h: number = 0;
    lastTime = 0;
    sumTime = 0;
    doUpdate(time: number) {
        const deltaTime = time - this.lastTime;
        this.lastTime = time;

        // random enemy
        if (Math.random() > 0.33 && (this.sumTime += deltaTime) > 1000) {
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
}
