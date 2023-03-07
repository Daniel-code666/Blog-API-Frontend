import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private headers: any

  constructor(private http: HttpClient) { 
    if (sessionStorage.getItem('Token') != null) {
      this.headers = new HttpHeaders({
        'Authorization': 'Bearer ' + sessionStorage.getItem('Token')
      })
    }
  }

  public Login(user: object): any {
    return this.http.post<any>(environment.HOSTUSERS + "Login", user)
  }

  public Register(user: object): any {
    return this.http.post<any>(environment.HOSTUSERS + "Register", user)
  }

  public CheckRole(tkn: string): any {
    this.headers = new HttpHeaders({
      'Authorization': 'Bearer ' + tkn
    })

    return this.http.get<any>(environment.HOSTUSERS + "CheckRole", { headers: this.headers })
  }

  public GetIdFromTkn(): any {
    return this.http.get<any>(environment.HOSTUSERS + "GetIdFromToken", { headers: this.headers })
  }
}
