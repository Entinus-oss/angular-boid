import { Component, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { ParamService } from '../param.service'
import * as p5 from 'p5';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit {
  @ViewChild('canvas') canvas!: ElementRef;

  numberOfBoids: number = 600;
  listOfBoids: Boid[] = [];
  boidSize: number = 3;
  boidColor: string = "#DBDBDB";

  BoidNumberHasChange: Boolean = false;
  currentBoidNumber!: number;

  private ctx!: CanvasRenderingContext2D;
  param: any;

  constructor(
    private paramService: ParamService,
  ) { }

  public screenWidth: any;
  public screenHeight: any;
  
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
  }

  ngOnInit() {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      this.paramService.currentParam.subscribe(param => this.param = param);
  }

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.ctx.globalAlpha = 0.8;
    this.initialize();
    window.requestAnimationFrame(this.update.bind(this));
  }

  spawn() {
    let x:number = Math.floor(Math.random() * this.canvas.nativeElement.width+1);
    let y:number = Math.floor(Math.random() * this.canvas.nativeElement.height+1);

    let position = new p5.Vector(x, y);
    let velocity = p5.Vector.random2D();
    velocity.setMag(Math.random() * 4 - 2);
    let acceleration = new p5.Vector(0, 0);

    this.listOfBoids.push(new Boid(position, velocity, acceleration));
  }

  initialize() {
    for (let i = 0; i < this.param.numberOfBoids; i++){
      this.spawn();
    }
    this.currentBoidNumber = this.param.numberOfBoids;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    for (let boid of this.listOfBoids) {
      this.ctx.fillStyle = this.boidColor;
      this.ctx.beginPath();
      this.ctx.arc(boid.position.x, boid.position.y, this.boidSize, 0, 2 * Math.PI);
      this.ctx.fill();
    }
  }

  update() {

    if (this.param.reset) {
      this.listOfBoids = [];
      this.initialize();
      this.param.reset = false;
    }

    this.updateBoidNumber()
    for (let boid of this.listOfBoids) {
      this.wallThrough(boid);
      // this.wallCollision(boid);

      boid.acceleration.add(this.cohesion(boid).mult(this.param.cohesion));
      boid.acceleration.add(this.separation(boid).mult(this.param.separation));
      boid.acceleration.add(this.alignement(boid).mult(this.param.alignement));

      boid.velocity.add(boid.acceleration);
      boid.velocity.limit(this.param.maxSpeed);

      boid.position.add(boid.velocity);

      boid.acceleration.mult(0)
    }

    this.draw();
    window.requestAnimationFrame(this.update.bind(this));
  }

  updateBoidNumber() {
    if (this.currentBoidNumber > this.param.numberOfBoids) {
      let boidDelta = this.currentBoidNumber - this.param.numberOfBoids;
      for (let i = 0; i<boidDelta; i++){
        this.listOfBoids.shift();
      }
    }
    else if (this.currentBoidNumber < this.param.numberOfBoids) {
      let boidDelta = this.param.numberOfBoids -this.currentBoidNumber;
      for (let i = 0; i<boidDelta; i++){
        this.spawn();
      }
    }
    this.currentBoidNumber = this.listOfBoids.length;
    //console.log(this.currentBoidNumber)
  }

  seeBoidposition() {
    for (let boid of this.listOfBoids) {
      console.log(boid.position.x, boid.position.y);
    }
  }

  wallThrough(boid: Boid) {
    if (boid.position.x > this.canvas.nativeElement.width) {
      boid.position.x = 0;
    } else if (boid.position.x < 0) {
      boid.position.x = this.canvas.nativeElement.width;
    } else if (boid.position.y > this.canvas.nativeElement.height) {
      boid.position.y = 0
    } else if (boid.position.y < 0) {
      boid.position.y = this.canvas.nativeElement.height;
    }
  }
  

  wallCollision(boid: Boid) {
      if (boid.position.x >= this.canvas.nativeElement.width || boid.position.x <= 0) {
        boid.velocity.x = -boid.velocity.x;
      } else if (boid.position.y >= this.canvas.nativeElement.height || boid.position.y <= 0) {
        boid.velocity.y = -boid.velocity.y
      } 
   }

  cohesion(boid: Boid) {

    let steer = new p5.Vector;
    let total: number = 0;

    for (let other of this.listOfBoids) {
      let d: number = boid.position.dist(other.position)
      if (boid != other && d < this.param.cohesionRadius) {
        steer.add(other.position);
        total++;
      }
    }

    if (total > 0) {
      steer.div(total);
      steer.sub(boid.position);
      steer.setMag(this.param.maxSpeed);
      steer.sub(boid.velocity);
      steer.limit(this.param.maxAcceleration);
    }

    return steer
  }

  separation(boid: Boid) {

    let steer = new p5.Vector;
    let total = 0;

    for (let other of this.listOfBoids) {

      let d: number = boid.position.dist(other.position);

      if (boid != other && d < this.param.separationRadius){

        let diff = p5.Vector.sub(boid.position, other.position)
        diff.div(d * d);

        steer.add(diff);
        total++;
      }
    }

    if (total > 0) {
      steer.div(total);
      steer.setMag(this.param.maxSpeed);
      steer.sub(boid.velocity)
      steer.limit(this.param.maxAcceleration);
    }
    return steer
  }

  alignement(boid: Boid) {

    let steer: p5.Vector = new p5.Vector;
    let total: number = 0;
  
    for (let other of this.listOfBoids) {

      let d: number = boid.position.dist(other.position);

      if (boid != other && d < this.param.alignementRadius) {
        steer.add(other.velocity)
        total++;
      }
    }

    if (total > 0) {
      steer.div(total);
      steer.setMag(this.param.maxSpeed);
      steer.sub(boid.velocity)
      steer.limit(this.param.maxAcceleration);
    }

    return steer
  }
}

export class Boid {

  constructor(
    public position: p5.Vector,
    public velocity: p5.Vector,
    public acceleration: p5.Vector,
  ) {}  
}
