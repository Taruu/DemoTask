import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from "../environments/environment";

@Injectable()
export class AppService {
  constructor(private http: HttpClient) { }

  apiEndpoint = environment.apiEndpoint;

  getListElctricityMeters(){
    return this.http.get<ElectricityMeter[]>(this.apiEndpoint + "/ElectricityMeter");

  }
}
export interface ElectricityMeter {
  electricityCountId: number;
  serialNumber: string;
  name: string;
}
