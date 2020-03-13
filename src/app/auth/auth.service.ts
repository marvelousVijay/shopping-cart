import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    apiTokenKey = 'AIzaSyAXe5P7TNVH_aewGbX3GmqJ8967O3yK1wI';
    authSignUpRequestUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
    authLoginRequestUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';
    user = new BehaviorSubject<User>(null);
    tokenExpirationTimer: any;

    constructor(private http: HttpClient, private router: Router) {}

    signUp(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            this.authSignUpRequestUrl + this.apiTokenKey,
            {
                email,
                password,
                returnSecureToken: true
            }
        )
        .pipe(
            catchError(this.handleError), 
            tap(resData => {
                this.handleAuthentication(resData);
            })
        );
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            this.authLoginRequestUrl + this.apiTokenKey, {
                email,
                password,
                returnSecureToken: true
            }
        )
        .pipe(
            catchError(this.handleError),
            tap(resData => {
                this.handleAuthentication(resData);
            })
        );
    }

    autoLogin() {
        const userData: {
            email: string;
            id: string;
            _token: string;
            _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return;
        }
        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
        if (loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);

        }
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number) {
        console.log('duration: ', expirationDuration);
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration);
    }

    isAuthenticated() {
        return this.user.subscribe(user => {
            return !!user;
        });
    }

    private handleAuthentication(authResponse: AuthResponseData) {
        const expirationDate = new Date(
            new Date().getTime() + +authResponse.expiresIn * 1000);
        const user = new User(
            authResponse.email, 
            authResponse.localId, 
            authResponse.idToken, 
            expirationDate);
        this.user.next(user);
        this.autoLogout(+authResponse.expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorResponse: HttpErrorResponse) {
        let errorMessage = 'An unknown error occured !!';
        if (!errorResponse.error || !errorResponse.error.error) {
            return throwError(errorMessage);
        }
        switch(errorResponse.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'The provided email already exists!';
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = "Please enter a valid email address!";
                break;
            case 'INVALID_PASSWORD':
                errorMessage = "Please enter the correct password!";
                break;
            case 'USER_DISABLED':
                errorMessage = "Please enter a valid user credential!";
                break;
        }
        return throwError(errorMessage);
    }
}
