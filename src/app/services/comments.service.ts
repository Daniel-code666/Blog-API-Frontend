import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private headers: any

  constructor(private http: HttpClient) {
    if (sessionStorage.getItem('Token') != null) {
      this.headers = new HttpHeaders({
        'Authorization': 'Bearer ' + sessionStorage.getItem('Token')
      })
    }
  }

  public GetAllComments(): any {
    return this.http.get<any>(environment.HOSTCOMMENTS + "getAllComms.php")
  }

  public GetCommentsByArticle(comm_art_id: Number): any {
    return this.http.get<any>(environment.HOSTCOMMENTS + "getCommByArt.php?comm_art_id=" + comm_art_id)
  }

  public CreateComment(comm: object): any {
    return this.http.post<any>(environment.HOSTCOMMENTS + "createComm.php", comm, { headers: this.headers })
  }

  public UpdtComment(comm: object): any {
    return this.http.put<any>(environment.HOSTCOMMENTS + "updtComm.php", comm, { headers: this.headers })
  }

  public DeleteComment(comm_id: number): any {
    return this.http.delete<any>(environment.HOSTCOMMENTS + "deleteComm.php?comm_id=" + comm_id, { headers: this.headers })
  }
}
