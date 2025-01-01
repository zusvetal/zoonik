import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <h1>Zoonika</h1>
    <router-outlet></router-outlet>
  `,
  imports: [
    RouterOutlet
  ],
})
export class AppComponent {

}
