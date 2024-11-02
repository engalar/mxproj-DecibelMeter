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
    }
    addEnemy() {
        const x = Math.random() * (window.innerWidth - 50);
        const y = -50;
        const enemy = new Enemy(x, y, this.layer);
        this.enemies.push(enemy);
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
    checkCollision() {
        for (let i = 0; i < this.bullets.length; i++) {
            const bullet = this.bullets[i];
            for (let j = 0; j < this.enemies.length; j++) {
                const enemy = this.enemies[j];
                if (
                    bullet.x + bullet.width > enemy.x &&
                    bullet.x < enemy.x + enemy.width &&
                    bullet.y + bullet.height > enemy.y &&
                    bullet.y < enemy.y + enemy.height
                ) {
                    this.bullets.splice(i, 1);
                    this.layer.remove(bullet.shape);
                    this.layer.draw();
                    this.enemies.splice(j, 1);
                    this.layer.remove(enemy.shape);
                    this.layer.draw();
                    this.score += 10;
                    break;
                }
            }
        }
    }
    update() {
        if (!this.gameOver) {
            this.addEnemy();
            this.moveEnemies();
            this.moveBullets();
            this.checkCollision();
            requestAnimationFrame(() => this.update());
        }
    }
}
