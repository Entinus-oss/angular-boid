import { Component, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ParamService } from '../param.service';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'app-menu',
  animations: [
    trigger('openCloseSidebar', [

      state('open', style({})),
      state('closed', style({transform: 'translateX(-185px)'})),

      transition('open => closed', [animate('0.5s')]),
      transition('closed => open', [animate('0.5s')]),

    ]),

  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  isOpen: Boolean = true;

  param: any;

  defaultParam: any = {
    cohesion : 1,
    separation : 1,
    alignement : 1,
    cohesionRadius: 50,
    separationRadius: 20,
    alignementRadius: 80,
    numberOfBoids : 100,
    maxAcceleration: 0.05,
    maxSpeed: 2,
    reset: true,
  };

  toggle() {
    this.isOpen = !this.isOpen;
  }

  constructor(
    private paramService: ParamService,
  ) { }

  ngOnInit(): void {
    this.paramService.currentParam.subscribe(param => this.param = param);
  }

  ngOnDestroy(): void {
    this.param.unsubscribe()
  }

  reset() {
    Object.assign(this.param, this.defaultParam);
    this.paramService.changeParam(this.param);
    //console.log(this.param.reset);
  }

  updateCohesion(event: MatSliderChange) {
    this.param.cohesion = event.value;
    this.paramService.changeParam(this.param);
    // console.log(this.param);
  }

  updateCohesionRadius(event: MatSliderChange) {
    this.param.cohesionRadius = event.value;
    this.paramService.changeParam(this.param);
    // console.log(this.param);
  }

  updateSeparation(event: MatSliderChange) {
    this.param.separation = event.value;
    this.paramService.changeParam(this.param);
    // console.log(this.param);
  }

  updateSeparationRadius(event: MatSliderChange) {
    this.param.separationRadius = event.value;
    this.paramService.changeParam(this.param);
    // console.log(this.param);
  }

  updateAlignement(event: MatSliderChange) {
    this.param.alignement = event.value;
    this.paramService.changeParam(this.param);
    // console.log(this.param);
  }

  updateAlignementRadius(event: MatSliderChange) {
    this.param.alignementRadius = event.value;
    this.paramService.changeParam(this.param);
    // console.log(this.param);
  }

  updateNumberOfBoids(event: MatSliderChange) {
    this.param.numberOfBoids = event.value;
    this.paramService.changeParam(this.param);
    // console.log(this.param);
  }

  updateMaxAcceleration(event: MatSliderChange) {
    this.param.maxAcceleration = event.value;
    this.paramService.changeParam(this.param);
    // console.log(this.param);
  }

  updateMaxSpeed(event: MatSliderChange) {
    this.param.maxSpeed = event.value;
    this.paramService.changeParam(this.param);
    // console.log(this.param);
  }
}
