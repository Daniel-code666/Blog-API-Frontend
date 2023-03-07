import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IntercommService } from 'src/app/services/intercomm.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  constructor(private router: Router, private userServ: UserService, private intercomm: IntercommService) { }

  registerForm = new FormGroup({
    fullName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  ngOnInit(): void {
    if (sessionStorage.getItem('Token') != null) {
      sessionStorage.clear()
      window.location.reload()
    }
  }

  register() {
    let user = {
      userName: this.registerForm.get('fullName').value,
      userEmail: this.registerForm.get('email').value,
      password: this.registerForm.get('password').value
    }

    this.userServ.Register(user).subscribe({
      next: (data: any) => {
        console.log(data)
        this.registerForm.reset()
        Swal.fire(
          '',
          'El usuario ' + data.result.userName + " ha sido creado",
          'success'
        )
      },
      error: (e) => {
        Swal.fire(
          '',
          'Hubo un error ' + e.message,
          'error'
        )
      }
    })
  }
}
