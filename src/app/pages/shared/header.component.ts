import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IntercommService } from 'src/app/services/intercomm.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  isLogged: string = ""
  isAdmin: string = ""

  constructor(private userServ: UserService, private router: Router, private intercomm: IntercommService) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('adm') != null && sessionStorage.getItem('log') != null) {
      this.intercomm.updateApprovalMessage(sessionStorage.getItem('log'))
      this.intercomm.updateApprovalMessage2(sessionStorage.getItem('adm'))

      this.intercomm.currentApprovalStageMessage.subscribe({
        next: (data: any) => {
          this.isLogged = data
          console.log(data)
        }
      })

      this.intercomm.currentApprovalStageMessage2.subscribe({
        next: (data: any) => {
          this.isAdmin = data
          console.log(data)
        }
      })
    } else {
      this.intercomm.currentApprovalStageMessage.subscribe({
        next: (data: any) => {
          this.isLogged = data
          console.log(data)
        }
      })

      this.intercomm.currentApprovalStageMessage2.subscribe({
        next: (data: any) => {
          this.isAdmin = data
          console.log(data)
        }
      })
    }
  }

  log_out() {
    this.intercomm.updateApprovalMessage(this.isLogged = "false")
    sessionStorage.clear()
    this.router.navigate(['/home']).then(() => { window.location.reload() });
  }
}
