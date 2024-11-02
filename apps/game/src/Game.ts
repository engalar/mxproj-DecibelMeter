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
    constructor(container: HTMLDivElement) {
        const stage = new Konva.Stage({
            width: window.innerWidth,
            height: window.innerHeight,
            container,
        });
        this.layer = new Konva.Layer();
        stage.add(this.layer);

        this.plane = new Plane(100, 100, this.layer);
        this.enemies = [];
        this.bullets = [];
        this.score = 0;
        this.gameOver = false;

        new SkyBackground(this.layer);

        // 监听窗口大小变化
        window.addEventListener("resize", () => {
            stage.width(window.innerWidth);
            stage.height(window.innerHeight);
            stage.batchDraw();
        });

        // 监听键盘按下事件
        document.addEventListener("keydown", (e) => {
            if (e.key === " ") {
                debugger;
                if (this.gameOver) {
                    debugger;
                    this.restart();
                } else {
                    this.shoot();
                }
            }
        });

        // 开始游戏循环
        this.update();
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
    moveEnemies() {
        for (let i = 0; i < this.enemies.length; i++) {
            const enemy = this.enemies[i];
            enemy.move();
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
    moveBullets() {
        for (let i = 0; i < this.bullets.length; i++) {
            const bullet = this.bullets[i];
            bullet.move();
            if (bullet.y < 0) {
                this.bullets.splice(i, 1);
                this.layer.remove(bullet.shape);
                this.layer.draw();
            }
        }
    }
    update() {
        let h: number;
        const doUpdate = () => {
            this.moveEnemies();
            this.moveBullets();
            this.checkCollision();
        };
        setInterval(() => {
            if (!this.gameOver) {
                cancelAnimationFrame(h);
                h = requestAnimationFrame(() => doUpdate());
            }
        }, 1000 / 60);
    }
}
