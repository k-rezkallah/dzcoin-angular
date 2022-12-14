import { Component, OnInit } from '@angular/core';
import { faTelegramPlane } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  filmIcon = faTelegramPlane;

  constructor() {}

  ngOnInit(): void {}

  joinUs() {
    console.log('redirect and join us on telegram');
    window.location.href = 'https://t.me/+AxO9NPgey7BmYTYy';
  }
}
