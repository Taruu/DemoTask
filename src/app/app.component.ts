import {Component, OnInit} from '@angular/core';
import {DataClientService, ElectricityMeter, ElectricityMeterValues, ElectricityValue} from "./dataClient.service";
import {Observable} from "rxjs";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private dataClientService: DataClientService) {
  }

  title = 'DemoTask';
  displayedColumns: string[] = ['startDate', 'activeReceiveMean', 'activeOutputMean', 'reactiveReceiveMean', 'reactiveOutputMean']
  listElctricityMeter: ElectricityMeter[] = [];
  takedElectricityCountId: number = 0;

  tableValues: electricityValueRow[] = [];

  nowDate: Date = new Date();
  maxDate: Date = new Date();
  minDate: Date = new Date();


  ngOnInit() {
    this.dataClientService.getListElctricityMeters().subscribe(list => {
      this.listElctricityMeter = list;
      console.log(this.listElctricityMeter);
    });
  }

  dataCalcToTable(resultWithData: ElectricityMeterValues) {
    const electricityCountValues = resultWithData.electricityCountValues;
    this.tableValues = []
    for (let range in electricityCountValues) {
      let listValues: ElectricityValue[] = electricityCountValues[range];
      let valueRow: electricityValueRow = {
        startDate: new Date(range),
        endDate: new Date(new Date(range).getTime() + 30 * 60000),
        activeReceiveMean: this.calculateMeanValue(listValues, "activeReceive"),
        activeOutputMean: this.calculateMeanValue(listValues, "activeOutput"),
        reactiveReceiveMean: this.calculateMeanValue(listValues, "reactiveReceive"),
        reactiveOutputMean: this.calculateMeanValue(listValues, "reactiveOutput"),
      }
      this.tableValues.push(valueRow)
    }
    this.tableValues.sort(function (a, b) {
      return a.startDate.getTime() - b.startDate.getTime()
    });
    console.log(this.tableValues)
  }

  private calculateMeanValue(listArray: ElectricityValue[], key: "activeReceive" | "activeOutput" | "reactiveReceive" | "reactiveOutput") {
    let sumactiveReceive: number = listArray.reduce(function (accumulator: number, currentValue: ElectricityValue, index: number, array: ElectricityValue[]) {
      return accumulator + currentValue[key];
    }, 0);
    return sumactiveReceive / listArray.length;
  }

  ngChangeDateElctricityMeter(event: any) {
    this.dataClientService.getElectricitValuesById(this.takedElectricityCountId).subscribe(result => {
      this.nowDate = event.target.value;
      this.dataClientService.getElectricitValuesById(this.takedElectricityCountId, this.nowDate).subscribe(resultWithData => this.dataCalcToTable(resultWithData))
    })
    return;
  }


  ngChangeSelectedElctricityMeter() {
    this.dataClientService.getElectricitValuesById(this.takedElectricityCountId).subscribe(result => {
      this.maxDate = new Date(result.rangeDates.maxDate);
      this.minDate = new Date(result.rangeDates.minDate);
      this.nowDate = this.maxDate;
      this.dataClientService.getElectricitValuesById(this.takedElectricityCountId, this.nowDate).subscribe(resultWithData => this.dataCalcToTable(resultWithData))
    })
    return;
  }
}

interface electricityValueRow {
  startDate: Date;
  endDate: Date;
  activeReceiveMean: number;
  activeOutputMean: number;
  reactiveReceiveMean: number;
  reactiveOutputMean: number;
}
