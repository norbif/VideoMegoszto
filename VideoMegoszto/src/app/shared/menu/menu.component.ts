import { Component, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenav } from '@angular/material/sidenav';
import { RouterLink, RouterModule } from '@angular/router';


@Component({
  selector: 'app-menu',
  imports: [MatListModule,RouterLink,RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  @Input() menuItems!: MatSidenav ;
}
