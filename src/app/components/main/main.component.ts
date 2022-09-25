import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
// import { faArrowsAltV } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';
import { faDollar, faEuro, faRuble } from '@fortawesome/free-solid-svg-icons';
import { fromEvent, interval, map, switchMap, tap } from 'rxjs';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  // dz rate
  dzaSendRating: number = environment.dza.send;
  dzaReceiveRating: number = environment.dza.receive;
  // rub rate
  rubSendRating: number = environment.ruble.send;
  rubReceiveRating: number = environment.ruble.receive;

  sendCurrencySymbole: string = 'dza';
  receiveCurrencySymbole: string = 'ruble';

  // curruncy symbols
  euroSign = faEuro;
  rubSign = faRuble;
  dzaSign = faDollar;

  lastUpdate: string = new Date().toDateString();
  sendCurrency: string = 'dza';
  receiveCurrency: string = 'ruble';
  sendAmount: number = environment.dza.send;
  receiveAmount!: number;

  mainForm!: FormGroup;

  //input form event
  @ViewChild('inputSend', { static: true, read: ElementRef })
  inputSend!: ElementRef;
  @ViewChild('inputReceive', { static: true, read: ElementRef })
  inputReceive!: ElementRef;

  // form select event
  @ViewChild('selectSend', { static: true, read: ElementRef })
  selectSend!: ElementRef;
  @ViewChild('selectReceive', { static: true, read: ElementRef })
  selectReceive!: ElementRef;

  constructor() {}

  ngOnInit(): void {
    this.receiveAmount = this.currencyReceiveRate();

    fromEvent<InputEvent>(this.inputSend.nativeElement, 'input').subscribe(() =>
      this.sendChange()
    );

    fromEvent<InputEvent>(this.inputReceive.nativeElement, 'input').subscribe(
      () => this.receiveChange()
    );
  }

  // caluculate the receive rate depending receive/send currency and rates
  currencyReceiveRate(): number {
    let heighAmount: boolean = false;
    let receive: number = 0;

    if (this.sendCurrency === this.receiveCurrency) return this.sendAmount;

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
  // caluculate the send rate depending receive/send currency and rates
  currencySendRate(): number {
    let send: number = 0;

    // if it's the same currency
    if (this.sendCurrency === this.receiveCurrency) return this.sendAmount;

    // else we should consider currency
    if (this.receiveCurrency === 'dza') {
      send = this.receiveAmount / this.dzaReceiveRating;
      if (this.sendCurrency === 'ruble') send = send * this.rubSendRating;
    } else if (this.receiveCurrency === 'ruble') {
      send = this.receiveAmount / this.rubReceiveRating;
      if (this.sendCurrency === 'dza') send = send * this.dzaSendRating;
    } else {
      if (this.sendCurrency === 'dza')
        send = this.receiveAmount * this.dzaSendRating;
      else send = this.receiveAmount * this.rubSendRating;
    }
    return Number.parseFloat(send.toFixed(2));
  }
  // activated whenever send input value changed
  sendChange() {
    this.receiveAmount = this.currencyReceiveRate();
  }
  // activated whenever receive input value changed
  receiveChange() {
    this.sendAmount = this.currencySendRate();
  }
  // switch send and receive currencies rates and symbols
  switchCurrency() {
    const tempCurrency = this.receiveCurrency;
    this.receiveCurrency = this.sendCurrency;
    this.sendCurrency = tempCurrency;

    const tempAmount = this.receiveAmount;
    this.sendAmount = tempAmount;
    this.receiveAmount = this.currencyReceiveRate();

    const tempCurrencySymbole = this.receiveCurrencySymbole;
    this.receiveCurrencySymbole = this.sendCurrencySymbole;
    this.sendCurrencySymbole = tempCurrencySymbole;
  }

  receiveCurrencyChange() {
    this.receiveAmount = this.currencyReceiveRate();
    this.receiveCurrencySymbole = this.receiveCurrency;
  }

  sendCurrencyChange() {
    this.receiveAmount = this.currencyReceiveRate();
    this.sendCurrencySymbole = this.sendCurrency;
  }

  setCurrencySybmol(currency: string): any {
    if (currency === 'dza') return this.dzaSign;
    else if (currency === 'ruble') return this.rubSign;
    else return this.euroSign;
  }
}
