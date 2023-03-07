import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleService } from 'src/app/services/article.service';
import { IntercommService } from 'src/app/services/intercomm.service';
import { UserService } from 'src/app/services/user.service';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { CommentsService } from 'src/app/services/comments.service';
declare var window: any;

@Component({
  selector: 'app-adm-article',
  templateUrl: './adm-article.component.html',
  styles: [
  ]
})
export class AdmArticleComponent implements OnDestroy, OnInit {

  articles: any
  formModal: any
  formModalUpdt: any
  formModalDelete: any
  formModalComment: any
  dtOptions: any = {}
  isSuccessful: boolean = false
  isLogged: string = ""
  isAdmin: string = ""

  img: SafeResourceUrl
  ext: string

  dtTrigger = new Subject<ADTSettings>();

  comm = {
    comm_text: '',
    art_id: 0,
  }

  constructor(private artServ: ArticleService, private router: Router, private intercomm: IntercommService,
    private userServ: UserService, private http: HttpClient, public _sanitizer: DomSanitizer,
    private commServ: CommentsService) { }

  newArtForm = new FormGroup({
    art_id: new FormControl(''),
    titulo: new FormControl('', Validators.required),
    texto: new FormControl('', Validators.required),
    imagen: new FormControl(''),
    img_ext: new FormControl(''),
    old_img: new FormControl('')
  })

  newCommForm = new FormGroup({
    comm_text: new FormControl('', Validators.required),
    art_id: new FormControl(''),
    art_name: new FormControl(''),
    art_desc: new FormControl(''),
  })

  ngOnInit(): void {
    this.userServ.CheckRole(sessionStorage.getItem('Token')).subscribe({
      next: (data: any) => {
        if (data.isSuccess) {
          this.formModal = new window.bootstrap.Modal(
            document.getElementById('myModal')
          )

          this.formModalUpdt = new window.bootstrap.Modal(
            document.getElementById('myModalUpdt')
          )

          this.formModalDelete = new window.bootstrap.Modal(
            document.getElementById('myModalDelete')
          )

          this.formModalComment = new window.bootstrap.Modal(
            document.getElementById('myModalAddComment')
          )

          this.getArticles()
        } else {
          sessionStorage.clear()
          this.router.navigate(['/home']).then(() => { window.location.reload() })
        }
      }
    })
  }

  getArticles() {
    this.dtOptions = {
      dom: 'Bfrtip',
      buttons: [
        'copy',
        'print',
        'csv',
        'excel',
        'pdf'
      ],
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
    }

    this.artServ.GetAllArticles().subscribe({
      next: (data: any) => {
        // this.intercomm.updateApprovalMessage(this.isLogged = "true")
        // this.intercomm.updateApprovalMessage2(this.isAdmin = "true")

        if (data.data != null) {
          this.articles = data.data
          this.dtTrigger.next(this.articles)
        }
      },
      error: (e) => {
        console.log(e)
        Swal.fire(
          '',
          'Algo sucedió...',
          'error'
        )
      }
    })
  }

  newArt(): void {
    const formData = new FormData()

    formData.append('titulo', this.newArtForm.get('titulo').value)
    formData.append('texto', this.newArtForm.get('texto').value)

    if (this.newArtForm.get('imagen').value != null) {
      formData.append('imagen', this.newArtForm.get('imagen').value)
    } else {
      formData.append('imagen', null)
    }

    this.artServ.CreateArticle(formData).subscribe({
      next: (data: any) => {
        this.newArtForm.reset()

        this.formModal.hide()

        Swal.fire(
          '',
          'El producto ha sido creado',
          'success'
        ).then(() => { window.location.reload() })
      },
      error: (e) => {
        Swal.fire(
          '',
          'Algo sucedió... ' + e.message,
          'error'
        )
      }
    })
  }

  updtArt(): void {
    const formData = new FormData()

    formData.append('art_id', this.newArtForm.get('art_id').value)
    formData.append('titulo', this.newArtForm.get('titulo').value)
    formData.append('texto', this.newArtForm.get('texto').value)

    if (this.newArtForm.get('imagen').value != null) {
      formData.append('imagen', this.newArtForm.get('imagen').value)
    } else {
      formData.append('imagen', null)
    }

    if (this.newArtForm.get('old_img').value != null) {
      formData.append('oldImg', this.newArtForm.get('old_img').value)
    } else {
      formData.append('oldImg', null)
    }

    this.newArtForm.reset()

    this.formModalUpdt.hide()

    this.artServ.UpdtArticle(formData).subscribe({
      next: (data: any) => {
        console.log(data)

        Swal.fire(
          '',
          'El artículo ha sido editado',
          'success'
        ).then(() => { window.location.reload() })
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

  deleteArt(): void {
    this.artServ.DeleteArticle(Number(this.newArtForm.get('art_id').value)).subscribe({
      next: (data: any) => {
        this.newArtForm.reset()

        this.formModalDelete.hide()

        Swal.fire(
          '',
          'Artículo eliminado',
          'success'
        ).then(() => { window.location.reload() })
      },
      error: (e) => {
        Swal.fire(
          '',
          'Algo sucedió ' + e.message,
          'error'
        )
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
        )
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

  onFileSelect(event): void {
    const file = event.target.files[0]
    this.newArtForm.get('imagen').setValue(file)
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  openFormModalUpdt(art_id: number, art_name: string, art_desc: string, art_img: string, art_img_ext: string) {
    this.img = this._sanitizer.bypassSecurityTrustResourceUrl("data:image/" + art_img_ext + ";base64, " + art_img)

    this.newArtForm.patchValue({
      art_id: art_id,
      titulo: art_name,
      texto: art_desc,
      old_img: art_img,
      img_ext: art_img_ext
    })

    this.formModalUpdt.show()
  }

  openFormModalDelete(art_id: number, art_name: string, art_desc: string, art_img: string, art_img_ext: string) {
    this.img = this._sanitizer.bypassSecurityTrustResourceUrl("data:image/" + art_img_ext + ";base64, " + art_img)

    this.newArtForm.patchValue({
      art_id: art_id,
      titulo: art_name,
      texto: art_desc,
      old_img: art_img,
      img_ext: art_img_ext
    })

    this.formModalDelete.show()
  }

  openFormModal() {
    this.formModal.show();
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
