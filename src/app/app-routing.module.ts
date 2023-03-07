import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddArticleComponent } from './pages/articles/add-article.component';
import { AdmArticleComponent } from './pages/articles/adm-article.component';
import { ArticleComponent } from './pages/articles/article.component';
import { ViewArticleComponent } from './pages/articles/view-article.component';
import { AdmCommentComponent } from './pages/comments/adm-comment.component';
import { LoginComponent } from './pages/users/login.component';
import { RegisterComponent } from './pages/users/register.component';

const routes: Routes = [
  { path: 'home', component: ArticleComponent },
  { path: 'adm-articles', component: AdmArticleComponent },
  { path: 'adm-comments', component: AdmCommentComponent },
  { path: 'add-article', component: AddArticleComponent},
  { path: 'view-article/:art_id', component: ViewArticleComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: '**', pathMatch: 'full', redirectTo: 'home' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
