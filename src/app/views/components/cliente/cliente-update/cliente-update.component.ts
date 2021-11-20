import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-cliente-update',
  templateUrl: './cliente-update.component.html',
  styleUrls: ['./cliente-update.component.css']
})
export class ClienteUpdateComponent implements OnInit {

  id_cli = ''

  cliente: Cliente = {
    id: '',
    nome: '',
    cpf: '',
    telefone: ''
  }


  nome = new FormControl('', [Validators.minLength(5)])
  cpf = new FormControl('', [Validators.minLength(11)])
  telefone = new FormControl('', [Validators.minLength(14)])

  constructor(private router: Router,
    private service: ClienteService,
    private route: ActivatedRoute,
    private snack: MatSnackBar) { }

  ngOnInit(): void {
    this.id_cli = this.route.snapshot.paramMap.get('id')!
    this.findById();
  }

  findById(): void{
    this.service.findById(this.id_cli).subscribe(resposta =>{
      this.cliente = resposta;
    })
  }

  update(): void{
    this.service.update(this.cliente).subscribe((resposta) => {
      this.router.navigate(['clientes'])
      this.message('Cliente atualizado com sucesso!')
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
    this.router.navigate(['clientes'])
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

