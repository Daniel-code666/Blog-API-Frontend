import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ArticleService } from 'src/app/services/article.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styles: [
  ]
})
export class AddArticleComponent implements OnInit {

  newArtForm = new FormGroup({
    titulo: new FormControl('', Validators.required),
    texto: new FormControl('', Validators.required),
    imagen: new FormControl('')
  })


  constructor(private artServ: ArticleService, private router: Router, private userServ: UserService) { }

  ngOnInit(): void {
    this.userServ.GetIdFromTkn().subscribe({
      next: (data:any)=>{
        console.log("Usuario validado")
      },
      error: (e) => {
        sessionStorage.clear()
        this.router.navigate(['/home']).then(() => { window.location.reload() })
      }
    })
  }

  createArt(): void {
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

        Swal.fire(
          '',
          'El producto ha sido creado',
          'success'
        )
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

  onFileSelect(event): void {
    const file = event.target.files[0]
    this.newArtForm.get('imagen').setValue(file)
  }
}
