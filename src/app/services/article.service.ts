import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  private headers: any

  constructor(private http: HttpClient) {
    if (sessionStorage.getItem('Token') != null) {
      this.headers = new HttpHeaders({
        'Authorization': 'Bearer ' + sessionStorage.getItem('Token')
      })
    }
  }

  public GetAllArticles(): any {
    return this.http.get<any>(environment.HOSTARTICLES + "getAllArticles.php")
  }

  public CreateArticle(formData: FormData): any {
    return this.http.post<any>(environment.HOSTARTICLES + "createArticle.php", formData, { headers: this.headers })
  }

  public UpdtArticle(formData: FormData): any {
    return this.http.post<any>(environment.HOSTARTICLES + "updtArticle.php", formData, { headers: this.headers })
  }

  public DeleteArticle(art_id: number): any {
    return this.http.delete<any>(environment.HOSTARTICLES + "deleteArticle.php?art_id=" + art_id, { headers: this.headers })
  }

  public GetSingleArticle(art_id: number): any {
    return this.http.get<any>(environment.HOSTARTICLES + "getSingleArticle.php?art_id=" + art_id)
  }
}