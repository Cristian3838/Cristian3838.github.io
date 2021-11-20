import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Tecnico } from 'src/app/models/tecnico';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-tecnico-update',
  templateUrl: './tecnico-update.component.html',
  styleUrls: ['./tecnico-update.component.css']
})
export class TecnicoUpdateComponent implements OnInit {

  id_tec = ''

  tecnico: Tecnico = {
    id: '',
    nome: '',
    cpf: '',
    telefone: ''
  }


  nome = new FormControl('', [Validators.minLength(5)])
  cpf = new FormControl('', [Validators.minLength(11)])
  telefone = new FormControl('', [Validators.minLength(14)])

  constructor(private router: Router,
    private service: TecnicoService,
    private route: ActivatedRoute,
    private snack: MatSnackBar) { }

  ngOnInit(): void {
    this.id_tec = this.route.snapshot.paramMap.get('id')!
    this.findById();
  }

  findById(): void{
    this.service.findById(this.id_tec).subscribe(resposta =>{
      this.tecnico = resposta;
    })
  }

  update(): void{
    this.service.update(this.tecnico).subscribe((resposta) => {
      this.router.navigate(['tecnicos'])
      this.message('Técnico atualizado com sucesso!')
    },  err => {
      if (err.error.error.match('já cadastrado')) {
        this.message('CPF já cadastrado na base de dados!')
      } else if (err.error.errors[0].message === "número do registro de contribuinte individual brasileiro (CPF) inválido"
      ) {
        this.message(err.error.errors[0].message)
      }
    })
  }

  message(msg: String): void {
    this.snack.open(`${msg}`, 'OK', {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 4000
    })
  }

  cancel(): void {
    this.router.navigate(['tecnicos'])
  }

  errorValidName() {
    if (this.nome.invalid) {
      return 'O nome deve conter entre 5 a 100 caracteres!';
    }
    return false;
  }

  errorValidCpf() {
    if (this.cpf.invalid) {
      return 'O CPF deve conter entre 11 e 15 caracteres!'
    }
    return false;
  }

  errorValidTelefone() {
    if (this.telefone.invalid) {
      return 'O telefone deve conter entre 14 e 18 caracteres!'
    }
    return false;
  }
}


