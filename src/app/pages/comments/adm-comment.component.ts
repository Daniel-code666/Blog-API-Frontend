import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleService } from 'src/app/services/article.service';
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
  selector: 'app-adm-comment',
  templateUrl: './adm-comment.component.html',
  styles: [
  ]
})
export class AdmCommentComponent implements OnInit, OnDestroy {

  comments: any
  comm_state: number
  st_dic = { 1: 'Aceptado', 0: 'No aceptado' }
  formModal: any
  formModalUpdt: any
  formModalDelete: any
  dtOptions: any = {}
  isSuccessful: boolean = false
  isLogged: string = ""
  isAdmin: string = ""

  img: SafeResourceUrl
  ext: string

  dtTrigger = new Subject<ADTSettings>();

  comm = {
    comm_id: 0,
    comm_state: 0,
    comm_text: '',
    art_id: 0,
  }

  constructor(private artServ: ArticleService, private router: Router, private commServ: CommentsService,
    private userServ: UserService, private http: HttpClient, public _sanitizer: DomSanitizer) { }

  newCommForm = new FormGroup({
    comm_id: new FormControl(''),
    comm_text: new FormControl('', Validators.required),
    art_id: new FormControl(''),
    art_name: new FormControl(''),
    art_desc: new FormControl(''),
    comm_state: new FormControl('', Validators.required)
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

          this.getComments()
        } else {
          sessionStorage.clear()
          this.router.navigate(['/home']).then(() => { window.location.reload() })
        }
      }
    })
  }

  getComments(): any {
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

    this.commServ.GetAllComments().subscribe({
      next: (data: any) => {
        if (data.data != null) {
          this.comments = data.data
          this.dtTrigger.next(this.comments)
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

  addComm(): any {
    this.comm.art_id = this.newCommForm.get('art_id').value
    this.comm.comm_text = this.newCommForm.get('comm_text').value

    this.commServ.CreateComment(this.comm).subscribe({
      next: (data: any) => {
        console.log(data)

        this.newCommForm.reset()
        this.formModal.hide()

        Swal.fire(
          '',
          'Comentario creado... ',
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

  updtComm(): any {
    if (this.newCommForm.get('comm_state').value === "Aceptado") {
      this.comm.comm_id = this.newCommForm.get('comm_id').value
      this.comm.comm_state = 1
    } else if (this.newCommForm.get('comm_state').value === "No aceptado") {
      this.comm.comm_id = this.newCommForm.get('comm_id').value
      this.comm.comm_state = 0
    }

    this.commServ.UpdtComment(this.comm).subscribe({
      next: (data: any) => {
        console.log(data)

        this.newCommForm.reset()
        this.formModalUpdt.hide()

        Swal.fire(
          '',
          'Estado del comentario actualizado... ',
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

  deleteComm(): any {
    this.commServ.DeleteComment(this.newCommForm.get('comm_id').value).subscribe({
      next: (data: any) => {
        this.newCommForm.reset()
        this.formModalDelete.hide()

        Swal.fire(
          '',
          'Comentario eliminado... ',
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

  openFormModal(art_id: number, art_name: string, art_desc: string) {
    this.newCommForm.patchValue({
      art_id: art_id,
      art_name: art_name,
      art_desc: art_desc
    })

    this.formModal.show()
  }

  openFormModalUpdt(comm_id: number, comm_state: number) {
    this.newCommForm.patchValue({
      comm_id: comm_id,
      comm_state: comm_state
    })

    this.formModalUpdt.show()
  }

  openFormModalDelete(comm_id: number) {
    this.newCommForm.patchValue({
      comm_id: comm_id
    })

    this.formModalDelete.show()
  }

  convertKeyToNumber(key: string): Number {
    return Number(key)
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
