import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParamService {

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
    reset: false,
  };

  private parameters = new BehaviorSubject<any>(this.defaultParam);
  currentParam = this.parameters.asObservable();

  changeParam(param: any){
    this.parameters.next(param)
  }

  constructor() { }
}
