import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleService } from 'src/app/services/article.service';
import { IntercommService } from 'src/app/services/intercomm.service';
import { UserService } from 'src/app/services/user.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { CommentsService } from 'src/app/services/comments.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
declare var window: any;

@Component({
  selector: 'app-view-article',
  templateUrl: './view-article.component.html',
  styles: [
  ]
})
export class ViewArticleComponent implements OnInit {

  isLogged: boolean = false

  formModalComment: any

  art_id: number
  img: SafeResourceUrl
  img_ext: string

  comments: any

  article = {
    art_id: 0,
    art_name: '',
    art_desc: '',
    art_img: ''
  }

  comm = {
    comm_text: '',
    art_id: 0,
  }

  constructor(private artServ: ArticleService, private _sanitizer: DomSanitizer, private curRoue: ActivatedRoute,
    private userServ: UserService, private router: Router, private commServ: CommentsService) { }

  newCommForm = new FormGroup({
    comm_text: new FormControl('', Validators.required),
    art_id: new FormControl(''),
    art_name: new FormControl(''),
    art_desc: new FormControl(''),
  })

  ngOnInit(): void {
    if (sessionStorage.getItem('Token') != null) {
      this.userServ.GetIdFromTkn().subscribe({
        next: (data: any) => {
          this.isLogged = true

          this.formModalComment = new window.bootstrap.Modal(
            document.getElementById('myModalAddComment')
          )
        },
        error: (e) => {
          console.log(e)
        }
      })
    }

    this.getSingleArticle()
  }

  getSingleArticle(): void {
    this.art_id = Number(this.curRoue.snapshot.paramMap.get('art_id'))

    this.artServ.GetSingleArticle(this.art_id).subscribe({
      next: (data: any) => {
        this.commServ.GetCommentsByArticle(this.art_id).subscribe({
          next: (data1: any) => {
            this.article.art_id = data.data.art_id
            this.article.art_name = data.data.art_name
            this.article.art_desc = data.data.art_desc
            this.article.art_img = data.data.art_img

            this.img = this._sanitizer.bypassSecurityTrustResourceUrl("data:image/" +
              data.data.art_img_ext + ";base64, " + data.data.art_img)

            this.comments = data1.data
          },
          error: (e) => {
            console.log(e)
            Swal.fire(
              '',
              'Algo sucedió...',
              'error'
            ).then(() => this.router.navigate(['/']))
          }
        })
      },
      error: (e) => {
        console.log(e)
        Swal.fire(
          '',
          'Algo sucedió...',
          'error'
        ).then(() => this.router.navigate(['/']))
      }
    })
  }

  addComm(): any {
    this.comm.art_id = this.newCommForm.get('art_id').value
    this.comm.comm_text = this.newCommForm.get('comm_text').value

    this.commServ.CreateComment(this.comm).subscribe({
      next: (data: any) => {
        console.log(data)

        this.newCommForm.reset()
        this.formModalComment.hide()

        Swal.fire(
          '',
          'Comentario creado... ',
          'success'
        ).then(() => window.location.reload())
      },
      error: (e) => {
        console.log(e)
        Swal.fire(
          '',
          'Algo sucedió... ' + e.message,
          'error'
        )
      }
    })
  }

  openFormModalComment(art_id: number, art_name: string, art_desc: string) {
    this.newCommForm.patchValue({
      art_id: art_id,
      art_name: art_name,
      art_desc: art_desc
    })

    this.formModalComment.show()
  }
}
