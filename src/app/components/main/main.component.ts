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
  dzaSendRating: number = 216;
  dzaReceiveRating: number = 210;

  rubSendRating: number = 65;
  rubReceiveRating: number = 61;

  euroSendRating: number = 1;
  euroReceiveRating: number = 1;

  arrowIcon = faArrowsAltV;
  lastUpdate: string = new Date().toString();
  sendCurrency: string = 'dza';
  receiveCurrency: string = 'ruble';
  sendAmount: number = 1000;
  receiveAmount!: number;

  mainForm!: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}
  ngOnInit(): void {
    this.receiveAmount = this.currencyReceiveRate();
    this.mainForm = this._formBuilder.group({
      sendCurrencyControl: ['dza', Validators.required],
      sendAmountControl: [this.sendAmount, Validators.min(1000)],
      receiveCurrencyControl: ['ruble', Validators.required],
      receiveAmountControl: [this.receiveAmount, Validators.min(1000)],
    });
  }
  currencyReceiveRate(): number {
    let receive: number = 0;
    if (this.sendCurrency === 'dza') {
      if (this.receiveCurrency === 'ruble') {
        receive =
          (this.sendAmount / this.dzaSendRating) * this.rubReceiveRating;
      } else {
        receive = this.sendAmount / this.dzaSendRating;
      }
    } else if (this.sendCurrency === 'ruble') {
      if (this.receiveCurrency === 'dza')
        receive =
          (this.sendAmount / this.rubSendRating) * this.dzaReceiveRating;
      else receive = this.sendAmount / this.rubSendRating;
    } else {
      if (this.receiveCurrency === 'dza')
        receive = this.sendAmount * this.dzaReceiveRating;
      else receive = this.sendAmount * this.rubReceiveRating;
    }
    return Number.parseFloat(receive.toFixed(2));
  }
  currencySendRate(): number {
    let send: number = 0;
    if (this.receiveCurrency === 'dza') {
      if (this.sendCurrency === 'ruble')
        send =
          (this.receiveAmount / this.dzaReceiveRating) * this.rubSendRating;
      else send = this.receiveAmount / this.dzaSendRating;
    } else if (this.receiveCurrency === 'ruble') {
      if (this.sendCurrency === 'dza')
        send =
          (this.receiveAmount / this.rubReceiveRating) * this.dzaSendRating;
      else send = this.sendAmount / this.rubSendRating;
    } else {
      if (this.sendCurrency === 'dza')
        send = this.receiveAmount * this.dzaSendRating;
      else send = this.receiveAmount * this.rubSendRating;
    }
    return Number.parseFloat(send.toFixed(2));
  }
  calcCurrency() {
    this.receiveAmount = this.currencyReceiveRate();
  }
  sendChange() {
    console.log('sendChange()');
    this.receiveAmount = this.currencyReceiveRate();
  }
  receiveChange() {
    console.log('receiveChange()');
    this.sendAmount = this.currencySendRate();
  }

  switchCurrency() {
    const tempCurrency = this.receiveCurrency;
    this.receiveCurrency = this.sendCurrency;
    this.sendCurrency = tempCurrency;

    const tempAmount = this.receiveAmount;
    this.receiveAmount = this.sendAmount;
    this.sendAmount = tempAmount;

    this.receiveAmount = this.currencyReceiveRate();

    console.log(
      'switchCurrency done!',
      'send Currency is',
      this.mainForm.value['sendCurrencyControl'],
      'receive Currency is ',
      this.mainForm.value['receiveCurrencyControl']
    );
  }
  receiveCurrencyChange() {
    console.log('receiveCurrencyChange');
    this.sendAmount = this.currencySendRate();
  }

  sendCurrencyChange() {
    console.log('sendCurrencyChange');
    this.receiveAmount = this.currencyReceiveRate();
  }
}
