import { Injectable, inject } from "@angular/core";
import { Observable, Subject, map } from "rxjs";
import { ConnectedUser } from "@shared-lib/types";
import { LocalStorageService } from "@web/app/services/local-storage.service";

@Injectable({ providedIn: 'root' })
export class AuthService {

    private readonly localStorageService = inject(LocalStorageService);
    private readonly connectedUserSubj$ = new Subject<ConnectedUser | undefined>();    

    private readonly CONNECTED_USER_KEY = 'connectedUser';

    get connectedUser(): Observable<ConnectedUser | undefined> {
        return this.connectedUserSubj$.asObservable()
            .pipe(map(
                (user) => {
                    if(user) this.localStorageService.set<ConnectedUser>(this.CONNECTED_USER_KEY, user);
                    else this.localStorageService.remove(this.CONNECTED_USER_KEY);
                    return user;
                }
            ));
    }

    async login(user: ConnectedUser) {
        this.connectedUserSubj$.next(user);
    }

    async logout() {
        this.connectedUserSubj$.next(undefined);
    }
}