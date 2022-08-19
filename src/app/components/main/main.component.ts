import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { faArrowsAltV } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';
import {
  faDollar,
  faEuro,
  faRubleSign,
} from '@fortawesome/free-solid-svg-icons';
import { faRuble } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  dzaSendRating: number = environment.dza.send;
  dzaReceiveRating: number = environment.dza.receive;

  rubSendRating: number = environment.ruble.send;
  rubReceiveRating: number = environment.ruble.receive;

  sendCurrencySymbole: string = 'dza';
  receiveCurrencySymbole: string = 'ruble';

  euroSign = faEuro;
  rubSign = faRuble;
  dzaSign = faDollar;

  // arrowIcon = faArrowsAltV;

  // lastUpdate: string = new Date().toDateString();
  lastUpdate: string = 'Aug 20, 2022, 09:14:00 AM';
  sendCurrency: string = 'dza';
  receiveCurrency: string = 'ruble';
  sendAmount: number = 21600;
  receiveAmount!: number;

  mainForm!: FormGroup;

  constructor(private _formBuilder: FormBuilder) {}
  ngOnInit(): void {
    this.receiveAmount = this.currencyReceiveRate();
    this.mainForm = this._formBuilder.group({
      sendCurrencyControl: ['dza', Validators.required],
      sendAmountControl: [this.sendAmount, Validators.min(10)],
      receiveCurrencyControl: ['ruble', Validators.required],
      receiveAmountControl: [this.receiveAmount, Validators.min(10)],
    });
  }
  currencyReceiveRate(): number {
    let heighAmount: boolean = false;
    let receive: number = 0;

    if (this.sendCurrency === 'dza') {
      if (this.sendAmount >= (this.dzaSendRating - 1) * 1000) {
        heighAmount = true;
        receive = this.sendAmount / (this.dzaSendRating - 1);
      } else receive = this.sendAmount / this.dzaSendRating;

      if (this.receiveCurrency === 'ruble') {
        if (heighAmount) {
          console.log('hight amount');
          receive = receive * (this.rubReceiveRating + 1);
        } else receive = receive * this.rubReceiveRating;
      }
    } else if (this.sendCurrency === 'ruble') {
      receive = this.sendAmount / this.rubSendRating;
      if (this.receiveCurrency === 'dza')
        receive = receive * this.dzaReceiveRating;
    } else {
      if (this.receiveCurrency === 'dza')
        receive = this.sendAmount * this.dzaReceiveRating;
      else {
        if (this.sendAmount >= 1000) {
          receive = this.sendAmount * (this.rubReceiveRating + 1);
          console.log('hight amount');
        } else receive = this.sendAmount * this.rubReceiveRating;
      }
    }

    return Number.parseFloat(receive.toFixed(2));
  }

  currencySendRate(): number {
    let send: number = 0;

    if (this.receiveCurrency === 'dza') {
      console.log('inside  dza receive part');
      send = this.receiveAmount / this.dzaReceiveRating;
      if (this.sendCurrency === 'ruble') send = send * this.rubSendRating;
    } else if (this.receiveCurrency === 'ruble') {
      console.log('inside ruble receive part');
      send = this.receiveAmount / this.rubReceiveRating;
      if (this.sendCurrency === 'dza') send = send * this.dzaSendRating;
    } else {
      console.log('inside euro receive part');
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
    console.log('receiveCurrencyChange to =>', this.receiveCurrency);
    this.receiveAmount = this.currencyReceiveRate();
    this.receiveCurrencySymbole = this.receiveCurrency;
  }

  sendCurrencyChange() {
    console.log('sendCurrencyChange to =>', this.sendCurrency);
    this.receiveAmount = this.currencyReceiveRate();
    this.sendCurrencySymbole = this.sendCurrency;
  }

  setCurrencySybmol(currency: string): any {
    if (currency === 'dza') return this.dzaSign;
    else if (currency === 'ruble') return this.rubSign;
    else return this.euroSign;
  }
}
