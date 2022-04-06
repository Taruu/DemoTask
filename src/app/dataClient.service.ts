import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../environments/environment";
import {Observable} from "rxjs";
import {DatePipe} from '@angular/common'

@Injectable({
  providedIn: 'root'
})
export class DataClientService {
  constructor(private http: HttpClient, private datepipe: DatePipe) {
  }

  apiEndpoint = environment.apiEndpoint;

  public getListElctricityMeters(): Observable<ElectricityMeter[]> {
    console.log(this.apiEndpoint + "/ElectricityMeter")
    return this.http.get<ElectricityMeter[]>(this.apiEndpoint + "/ElectricityMeter");
  }

  public getElectricitValuesById(id: number, date?: Date): Observable<ElectricityMeterValues> {
    let paramsValue = {};
    if (date) {
      paramsValue = {params: {date: this.datepipe.transform(date, 'yyyy-MM-dd') + "Z"}}
    }
    return this.http.get<ElectricityMeterValues>(`${this.apiEndpoint}/ElectricityMeter/${id}`, paramsValue);
  }
}

export interface ElectricityMeter {
  electricityCountId: number;
  serialNumber: string;
  name: string;
}

export interface ElectricityMeterValues {
  electricityCountId: number;
  name: string;
  serialNumber: string;
  rangeDates: { minDate: Date, maxDate: Date };
  electricityCountValues: Record<string, ElectricityValue[]>;

}


export interface ElectricityValue {
  electricityValuesId: number;
  electricityCountForeignKey: number;
  createAt: Date;
  activeReceive: number;
  activeOutput: number;
  reactiveReceive: number;
  reactiveOutput: number;
}
