import { trigger, transition, style, animate } from '@angular/animations';
import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, TemplateRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbModal, NgbModalModule, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SidebarComponent } from '@web/app/components/sidebar/sidebar.component';
import { NavigationService } from '@web/app/services/navigation.service';
import { LoginComponent } from '@web/features/login/login.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, TranslateModule, NgbModalModule, AsyncPipe, SidebarComponent, LoginComponent],
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

  private readonly navigationService = inject(NavigationService);
  private readonly modalService = inject(NgbModal);


  title$ = this.navigationService.getRouteChange$().pipe(map((route => route?.data!['title'])));

  toogle = false;

  onClickLogin(content: TemplateRef<ElementRef>) {
		this.modalService.open(content, { fullscreen: true });
  }

  onLoginSuccess(modal: NgbModalRef) {
    modal.dismiss();
  }
}
