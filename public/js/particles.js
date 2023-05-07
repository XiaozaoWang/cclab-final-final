class Particle {
    constructor(x, y, xSpd, ySpd, dia) {
      this.x = x;
      this.y = y;
      this.xSpd = xSpd;
      this.ySpd = ySpd;
      this.dia = dia;
    }
    show() {
      push();
      translate(-windowX, -windowY - windowBar);
      circle(this.x, this.y, this.dia);
      pop();
    }
    move() {
      this.x += this.xSpd;
      this.y += this.ySpd;
    }
    shrink() {
      this.dia -= 0.2;
      if (this.dia < 1) {
        this.dia = 1;
      }
    }
  }
  