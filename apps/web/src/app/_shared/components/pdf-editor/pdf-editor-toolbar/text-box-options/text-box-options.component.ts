import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-text-box-options',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule],
  templateUrl: './text-box-options.component.html',
  styleUrl: './text-box-options.component.scss',
})
export class TextBoxOptionsComponent {

  fonts: string[] = ['Arial', 'Comic'];

}
