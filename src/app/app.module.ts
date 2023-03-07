import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataTablesModule } from "angular-datatables";
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ArticleComponent } from './pages/articles/article.component';
import { HeaderComponent } from './pages/shared/header.component';
import { FooterComponent } from './pages/shared/footer.component';
import { RegisterComponent } from './pages/users/register.component';
import { LoginComponent } from './pages/users/login.component';
import { AdmArticleComponent } from './pages/articles/adm-article.component';
import { AdmCommentComponent } from './pages/comments/adm-comment.component';
import { ViewArticleComponent } from './pages/articles/view-article.component';
import { AddArticleComponent } from './pages/articles/add-article.component';

@NgModule({
  declarations: [
    AppComponent,
    ArticleComponent,
    HeaderComponent,
    FooterComponent,
    RegisterComponent,
    LoginComponent,
    AdmArticleComponent,
    AdmCommentComponent,
    ViewArticleComponent,
    AddArticleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DataTablesModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
