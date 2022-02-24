import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private primengConf: PrimeNGConfig) {}
  title = 'test-toky-front';

  ngOnInit() {
    this.primengConf.ripple = true;
  }
}
