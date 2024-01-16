import { Injectable, inject } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RoutesRecognized } from "@angular/router";
import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private router = inject(Router);

  getRouteChange$(): Observable<ActivatedRouteSnapshot | null> {
    return this.router.events
    .pipe(
      filter(event => event instanceof RoutesRecognized)
    )
    .pipe(map((event) => (event as RoutesRecognized).state.root.firstChild))
  }

}