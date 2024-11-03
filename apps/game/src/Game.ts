import Konva from "konva";
import { Bullet } from "./Bullet";
import { Enemy } from "./Enemy";
import { Plane } from "./Plane";
import { SkyBackground } from "./SkyBackground";
import { Wave } from "./Wave";
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
        this.shoot = throttle(this.shoot.bind(this), 500);

        this.bg = new SkyBackground(this.bgLayer);
        this.wave = new Wave(0, 0, this.layer, this.shoot);

        this.onResize();
        window.addEventListener("resize", this.onResize);
        window.addEventListener("click", this.shoot);

        // TODO: 随机时防止重叠，并且随时增加敌机
        for (let i = 0; i < 10; i++) {
            this.addEnemy();
        }

        //TODO:play music
        // 开始游戏循环
        this.update();
    }

    destroy() {
        this.stage.destroy();
        this.bg.destroy();
        window.removeEventListener("resize", this.shoot);
        window.removeEventListener("click", this.shoot);
    }
    onResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.stage.width(width);
        this.stage.height(height);
        this.bg.onLayout(width, height);
        this.plane.onLayout(width, height);
        this.wave.onLayout(width, height);
    }

    // 添加敌机
    addEnemy() {
        const enemy = new Enemy(
            Math.random() * window.innerWidth,
            -50,
            this.layer,
        );
        this.enemies.push(enemy);
    }

    // 检测碰撞
    checkCollision() {
        this.enemies.forEach((enemy) => {
            this.bullets.forEach((bullet) => {
                if (enemy.isCollidingWith(bullet)) {
                    enemy.destroy();
                    bullet.destroy();
                    this.score++;
                }
            });
            if (enemy.isCollidingWith(this.plane)) {
                this.gameOver = true;
                // log
                console.log(this.score, "分数");
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
    doUpdate(time: number) {
        const deltaTime = time - this.lastTime;
        this.lastTime = time;
        this.moveEnemies(deltaTime);
        this.moveBullets(deltaTime);
        this.plane.onElapse(deltaTime);
        this.wave.onElapse(deltaTime);
        this.bg.onElapse(deltaTime);
        this.checkCollision();
    }
}
