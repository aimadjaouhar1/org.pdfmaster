import { trigger, transition, style, animate } from '@angular/animations';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, ElementRef, TemplateRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgbDropdownConfig, NgbDropdownModule, NgbModal, NgbModalModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { ConnectedUser } from '@shared-lib/types';
import { SidebarComponent } from '@web/app/components/sidebar/sidebar.component';
import { AuthService } from '@web/app/services/auth.service';
import { NavigationService } from '@web/app/services/navigation.service';
import { LoginComponent } from '@web/features/login/login.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, TranslateModule, NgbModalModule, NgbDropdownModule, AsyncPipe, NgTemplateOutlet, SidebarComponent, LoginComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  animations: [
    trigger(
      'inOutAnimation', 
      [
        transition(
          ':enter', 
          [
            style({ height: 50 }),
            animate('0.3s ease-out', 
                    style({ }))
          ]
        ),
        transition(
          ':leave', 
          [
            style({  }),
            animate('0.2s ease-in', 
                    style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class NavbarComponent {

  private readonly authService = inject(AuthService);
  private readonly navigationService = inject(NavigationService);
  private readonly modalService = inject(NgbModal);


  title$ = this.navigationService.getRouteChange$().pipe(map((route => route?.data!['title'])));
  toogle = false;

  connectedUser$ = this.authService.connectedUser.pipe(
          takeUntilDestroyed(),
          map(_connectedUser => this.connectedUser = _connectedUser))
        .subscribe();

  connectedUser?: ConnectedUser;


  constructor(config: NgbDropdownConfig) {
		config.placement = 'bottom-right';
  }

  onClickLogin(content: TemplateRef<ElementRef>) {
		this.modalService.open(content, { fullscreen: true });
  }

  onClickLogout() {
    this.authService.logout();
  }

  onLoginSuccess(modal: NgbModalRef) {
    modal.dismiss();
  }

}
