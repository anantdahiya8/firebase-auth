import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './shared/services/auth/auth.service';
import { FireStoreService } from './shared/services/firestore/firestore.service';
import { ButtonModule } from 'primeng/button';
import { LoaderService } from './shared/services/loader/loader.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabsModule } from 'primeng/tabs';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { Ripple } from 'primeng/ripple';
import { IftaLabelModule } from 'primeng/iftalabel';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgIf, ButtonModule, ProgressSpinnerModule, TabsModule, InputTextModule, FloatLabelModule, FormsModule, PasswordModule, AccordionModule, CommonModule, Toast, Ripple, IftaLabelModule, TextareaModule],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(
    private fireService: FireStoreService, 
    public loaderService: LoaderService, 
    private messageService: MessageService, 
    private authService: AuthService
  ) { }
  createEmail: string = '';
  createPassword: string = ''; 
  loginEmail: string = '';
  loginPassword: string = '';
  orderResponse: string = '';
  emailSend: string = '';
  emailSubject: string = '';
  emailBody: string = '';

  get user(): string | null {
    return this.authService.userName();
  }

  logout() {
    this.loaderService.show();
    this.authService.logout()
      .then(() => this.messageService.add({ severity: 'success', summary: 'Signed out', detail: 'You have been signed out', life: 3000 }))
      .catch(() => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Sign out failed', life: 3000 });
      })
      .finally(() => this.loaderService.hide());
  }


  create() {
    this.loaderService.show();
    this.authService.create(this.createEmail, this.createPassword)
      .then(() => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Account Created', life: 3000 });
      })
      .catch(() => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Unable to create account. Try again later!', life: 3000 });
      })
      .finally(() => this.loaderService.hide());
  }

  signInGmail() {
    this.loaderService.show();
    this.authService.signInWithGoogle()
      .then(() => {
        this.messageService.add({ severity: 'success', summary: 'Signed in', detail: 'Welcome back', life: 3000 });
      })
      .catch(() => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Google sign-in failed', life: 3000 });
      })
      .finally(() => this.loaderService.hide());
  }

  getOrders() {
    this.loaderService.show();
    this.fireService.getAllOrdersRealtime().subscribe({
      next: (orders) => {
        this.orderResponse = JSON.stringify(orders, null, 2);
        this.loaderService.hide()
      },
      error: (err) => {
        this.orderResponse = err;
        this.loaderService.hide()
      }
    });
  }

  getSingleOrder() {
    const userData = this.authService.userData();
    if (userData?.uid) {
      this.loaderService.show();
      this.fireService.getSingleOrder(userData.uid).subscribe({
        next: order => {
          this.orderResponse = JSON.stringify(order, null, 2);
          this.loaderService.hide()
        },
        error: err => {
          this.orderResponse = err;
          this.loaderService.hide()
        }
      });
    }
  }

  sendPasswordResetEmail() {
    const email = this.loginEmail;
    if (!email) {
      this.messageService.add({ severity: 'warn', summary: 'Missing email', detail: 'Please enter an email', life: 3000 });
      return;
    }
    this.loaderService.show();
    this.authService.sendPasswordReset(email)
      .then(() => this.messageService.add({ severity: 'success', summary: 'Email sent', detail: 'Password reset email sent', life: 3000 }))
      .catch((err) => {
        console.error('Password reset error:', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Unable to send password reset email', life: 3000 });
      })
      .finally(() => this.loaderService.hide());
  }

  signInWithEmail() {
    const email = this.loginEmail || '';
    const password = this.loginPassword || '';
    this.loaderService.show();
    this.authService.signInWithEmail(email, password)
      .then(() => {
        this.messageService.add({ severity: 'success', summary: 'Signed in', detail: 'Welcome back', life: 3000 });
      })
      .catch(() => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Email sign-in failed', life: 3000 });
      })
      .finally(() => this.loaderService.hide());
  }

  sendEmail(){
    this.loaderService.show();
    this.fireService.sendEmail([this.emailSend], this.emailSubject, this.emailBody)
      .then(() => {
        this.messageService.add({ severity: 'success', summary: 'Email Queued', detail: 'Email has been queued for sending', life: 3000 });
      })
      .catch(() => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to queue email', life: 3000 });
      })
      .finally(() => this.loaderService.hide()); 
  }

}
