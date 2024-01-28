import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Alert } from '@web/app/types/alert.types';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [NgClass, TranslateModule, NgbAlertModule],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
})
export class AlertComponent {
  @Input({required: true}) alert!: Alert;
}
