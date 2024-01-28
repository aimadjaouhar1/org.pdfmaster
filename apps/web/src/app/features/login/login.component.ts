import { AsyncPipe, NgClass } from '@angular/common';
import { Component, DestroyRef, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ILoginResponsePayload } from '@shared-lib/interfaces';
import { AuthHttp } from '@web/app/http/auth.http';
import { Alert } from '@web/app/types/alert.types';
import { ErrorResponse } from '@web/app/exception/error-response.interface';
import { AlertComponent } from '@web/shared/components/alert/alert.component';
import { map } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, AsyncPipe, NgClass, AlertComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {

  @Output() loginSuccess = new EventEmitter<void>();

  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);
  private readonly authHttp = inject(AuthHttp);
  
  loginForm = this.formBuilder.group({
    email: [''],
    password: [''],
    remember: [false]
  });

  get controls() {
    return this.loginForm?.controls;
  }

  isSubmitted = false;

  loginFailedAlert: Alert = {isVisible: false, message: '', type: 'danger'};


  ngOnInit(): void {
    this.loginForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.isSubmitted ?  this.isSubmitted = false : undefined );
  }

  onSubmit() {
    this.isSubmitted = true;

    if(this.loginForm.valid) {
      this.loginForm.disable({emitEvent: false});

      const {email, password} = this.loginForm.getRawValue();

      this.authHttp.login({email: email!, password: password!})
        .pipe(takeUntilDestroyed(this.destroyRef))
        .pipe(map((res) => {
          if((res as ErrorResponse).err) this.loginFailedHandler(res as ErrorResponse);
          else this.loginSuccessHnadler(res as ILoginResponsePayload);
        }))
        .subscribe();        
    }
  }

  private loginSuccessHnadler(loginResponsePayload: ILoginResponsePayload) {
      //this.loginSuccess.emit();
  }

  private loginFailedHandler(error: ErrorResponse) {
      this.loginFailedAlert.isVisible = true;
      this.loginFailedAlert.message = error.message;

      this.isSubmitted = false;
      this.controls.password.reset();
      this.loginForm.enable();
  }
}
