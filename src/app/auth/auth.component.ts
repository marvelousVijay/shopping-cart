import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-auth-component',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
    authForm: FormGroup;
    isLoginMode = true;
    isLoading = false;
    error: string = null;
    
    constructor(private authService: AuthService, private router: Router) {}
    
    ngOnInit() {
        this.authForm = new FormGroup({
            email: new FormControl(null, [Validators.required, Validators.email]),
            password: new FormControl(null, [Validators.required, Validators.minLength(6)])
        });
    }
    
    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }
    
    onAuthFormSubmit() {
        if (this.authForm.invalid) {
            return;
        }
        
        this.isLoading = true;
        const email = this.authForm.value.email;
        const password = this.authForm.value.password;
        let authObs: Observable<AuthResponseData>;
        
        if (this.isLoginMode) {
            authObs = this.authService.login(email, password);
        } else {
            authObs =  this.authService.signUp(email, password);
        }

        authObs.subscribe(authResponse => {
            console.log('Auth response: ', authResponse);
            this.isLoading = false;
            this.router.navigate(['/recipes']);
        }, errorMessage => {
            console.log('Auth error: ', errorMessage);
            this.error = errorMessage;
            this.isLoading = false;
        });
        
        this.authForm.reset();
    }
    
}
