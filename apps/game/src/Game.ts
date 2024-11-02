import Konva from "konva";
import { Bullet } from "./Bullet";
import { Enemy } from "./Enemy";
import { Plane } from "./Plane";
import { SkyBackground } from "./SkyBackground";

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
    constructor(container: HTMLDivElement) {
        const stage = new Konva.Stage({
            width: window.innerWidth,
            height: window.innerHeight,
            container,
        });
        this.stage = stage;
        this.layer = new Konva.Layer();
        this.bgLayer = new Konva.Layer();
        stage.add(this.bgLayer);
        stage.add(this.layer);

        this.plane = new Plane(100, 100, this.layer);
        this.enemies = [];
        this.bullets = [];
        this.score = 0;
        this.gameOver = false;

        this.bg = new SkyBackground(this.bgLayer);

        this.onResize = this.onResize.bind(this);
        this.shoot = this.shoot.bind(this);

        window.addEventListener("resize", this.onResize);
        window.addEventListener("click", this.shoot);

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
        this.stage.width(window.innerWidth);
        this.stage.height(window.innerHeight);
        this.stage.batchDraw();
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
                    debugger;
                    enemy.destroy();
                    bullet.destroy();
                    this.score++;
                }
            });
            if (enemy.isCollidingWith(this.plane)) {
                this.gameOver = true;
                // log
                console.log(this.score, "分数");
                debugger;
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
                this.layer.draw();
            }
        }
    }
    shoot() {
        const bullet = new Bullet(
            this.plane.x + this.plane.width / 2 - 5,
            this.plane.y - 10,
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
        this.checkCollision();
    }
}
