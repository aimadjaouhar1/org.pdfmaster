import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarComponent } from '@web/app/components/sidebar/sidebar.component';
import { NavigationService } from '@web/app/services/navigation.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, TranslateModule, AsyncPipe, SidebarComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {

  navigationService = inject(NavigationService);

  title$ = this.navigationService.getRouteChange$().pipe(map((route => route?.data!['title'])));

  toogle = false;
}
