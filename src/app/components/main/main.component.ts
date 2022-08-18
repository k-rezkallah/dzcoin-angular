import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faArrowsAltV } from '@fortawesome/free-solid-svg-icons';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  arrowIcon = faArrowsAltV;
  lastUpdate: string = new Date().toString();
  sendCurrency: string = 'dza';
  receiveCurrency: string = 'ruble';
  sendAmount: number = 1000;
  receiveAmount!: number;

  mainForm!: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}
  ngOnInit(): void {
    this.receiveAmount = this.currencyRate();
    this.mainForm = this._formBuilder.group({
      sendCurrencyControl: ['dza', Validators.required],
      sendAmountControl: [this.sendAmount, Validators.min(1000)],
      receiveCurrencyControl: ['ruble', Validators.required],
      receiveAmountControl: [this.receiveAmount, Validators.min(1000)],
    });
  }
  currencyRate(): number {
    return this.sendAmount * 3.31;
  }

  switchCurrency() {
    const tempCurrency = this.receiveCurrency;
    this.receiveCurrency = this.sendCurrency;
    this.sendCurrency = tempCurrency;

    const tempAmount = this.receiveAmount;
    this.receiveAmount = this.sendAmount;
    this.sendAmount = tempAmount;

    console.log(
      'switchCurrency done!',
      'send Currency is',
      this.mainForm.value['sendCurrencyControl'],
      'receive Currency is ',
      this.mainForm.value['receiveCurrencyControl']
    );
  }
}
