import { Injectable, inject } from "@angular/core";
import { BehaviorSubject, Observable, map } from "rxjs";
import { ConnectedUser } from "@shared-lib/types";
import { LocalStorageService } from "@web/app/services/local-storage.service";

@Injectable({ providedIn: 'root' })
export class AuthService {

    private readonly CONNECTED_USER_KEY = 'connectedUser';

    private readonly localStorageService = inject(LocalStorageService);
    private readonly connectedUserSubj$ = new BehaviorSubject<ConnectedUser | undefined>(this.fetchUserFromLocalStorage);    


    get connectedUser(): Observable<ConnectedUser | undefined> {
        return this.connectedUserSubj$.asObservable();
    }

    private get fetchUserFromLocalStorage(): ConnectedUser | undefined {
        return this.localStorageService.get<ConnectedUser>(this.CONNECTED_USER_KEY);
    }

    async login(user: ConnectedUser) {
        this.connectedUserSubj$.next(user);
        this.localStorageService.set<ConnectedUser>(this.CONNECTED_USER_KEY, user);

    }

    async logout() {
        this.connectedUserSubj$.next(undefined);
        this.localStorageService.remove(this.CONNECTED_USER_KEY);
    }

}