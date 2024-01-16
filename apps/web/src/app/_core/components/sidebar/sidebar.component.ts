import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '@web/env';
import { TranslateModule } from '@ngx-translate/core';

type MenuItem = {label: string, icon: string, link?: string, subMenuItems?: MenuItem[] };

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [TranslateModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  appName: string = environment.appName;

  menuItems: MenuItem[] = [
    { 
      label: 'LABELS.EDIT', 
      icon: 'bi bi-textarea-t',
      link: 'edit'
    },
    { 
      label: 'LABELS.SPLIT', 
      icon: 'bi bi-scissors',
      link: 'split',
    },
    { 
      label: 'LABELS.EXTRACT', 
      icon: 'bi bi-stack',
      link: 'extract'
    },
    {
      label: 'LABELS.ROTATE', 
      icon: 'bi bi-arrow-clockwise',
      link: 'rotate'
    },
    {
      label: 'LABELS.PROTECT',
      icon: 'bi bi-file-earmark-lock',
      link: ''
    }
  ];
  

}
