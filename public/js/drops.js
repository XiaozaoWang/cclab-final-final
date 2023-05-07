class Drop {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = random(10, 15);
        this.color = color(138, 43, 226);
    }

    fall() {
        this.y += this.speed;
        this.speed += 0.1;
    }

    rise() {
        this.y -= this.speed;
        this.speed += 0.1;
    }

    rightPush() {
        this.x += this.speed;
        this.speed += 0.1;
    }

    leftPush() {
        this.x -= this.speed;
        this.speed += 0.1;
    }

    showVertical() {
        push();
        translate(-windowX, -windowY - windowBar);
        stroke(this.color);
        line(this.x, this.y, this.x, this.y + 30);
        pop();
    }

    showHorizontal() {
        push();
        translate(-windowX, -windowY - windowBar);
        stroke(this.color);
        line(this.x, this.y, this.x + 30, this.y);
        pop();
    }
}
