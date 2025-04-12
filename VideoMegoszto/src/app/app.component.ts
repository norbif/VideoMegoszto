import { Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MenuComponent } from './shared/menu/menu.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatMiniFabButton } from '@angular/material/button';



@Component({
  selector: 'app-root',
  imports: [MatSidenavModule,MenuComponent,MatIconModule,MatToolbarModule,RouterModule,MatMiniFabButton],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Videó Megosztó';
}

