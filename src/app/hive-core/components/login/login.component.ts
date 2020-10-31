import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  loginError = false;

  constructor(
    private modal: ModalController,
    private auth: AuthenticationService) { }

  ngOnInit() { }

  login(): void {
    this.loginError = false;
    this.auth.authenticate(this.username, this.password).subscribe(loggedIn => {
      if (loggedIn) {
        this.dismiss();
      } else {
        this.loginError = true;
      }
    });
  }

  dismiss(): void {
    this.modal.dismiss();
  }

  usernameChange(username: string){
    this.username = username;
  }

  passwordChange(pwd: string){
    this.password = pwd;
  }
}
