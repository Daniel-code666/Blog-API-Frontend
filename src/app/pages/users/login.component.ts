import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IntercommService } from 'src/app/services/intercomm.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  isLogged = "false"
  isAdmin = "false"

  constructor(private router: Router, private userServ: UserService, private intercomm: IntercommService) { }

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  ngOnInit(): void {
    this.intercomm.currentApprovalStageMessage.subscribe(msg => this.isLogged = msg)

    if (sessionStorage.getItem('Token') != null){
      sessionStorage.clear()
      window.location.reload()
    }
  }

  login(): void {

    let user = {
      userEmail: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value
    }

    this.userServ.Login(user).subscribe({
      next: (data: any) => {
        this.loginForm.reset()
        sessionStorage.setItem(environment.TOKEN, data.result.token)
        sessionStorage.setItem("userName", data.result.userName)
        this.intercomm.updateApprovalMessage(this.isLogged = "true")

        this.userServ.CheckRole(data.result.token).subscribe({
          next: (data0: any) => {
            if (data0.isSuccess) {
              this.intercomm.updateApprovalMessage2(this.isAdmin = "true")
            } else {
              this.intercomm.updateApprovalMessage2(this.isAdmin = "false")
            }
            sessionStorage.setItem("adm", this.isAdmin)
          }
        })

        sessionStorage.setItem("log", this.isLogged)

        Swal.fire(
          '',
          'Bienvenido ' + data.result.userName,
          'success'
        )

        this.router.navigate(['/home'])
      },
      error: (e) => {
        console.log(e)
        Swal.fire(
          '',
          'Usuario o contraseña incorrecta',
          'error'
        )
      }
    })
  }
}
