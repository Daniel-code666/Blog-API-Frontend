import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleService } from 'src/app/services/article.service';
import { IntercommService } from 'src/app/services/intercomm.service';
import { UserService } from 'src/app/services/user.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styles: [
  ]
})
export class ArticleComponent implements OnInit {

  articles: any

  constructor(private artServ: ArticleService, private router: Router, private intercomm: IntercommService,
    private userServ: UserService, public _sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.artServ.GetAllArticles().subscribe({
      next: (data: any) => {
        this.articles = data.data
      }
    })
  }
}
