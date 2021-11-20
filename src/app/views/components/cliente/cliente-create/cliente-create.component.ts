import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-cliente-create',
  templateUrl: './cliente-create.component.html',
  styleUrls: ['./cliente-create.component.css']
})
export class ClienteCreateComponent implements OnInit {

  cliente: Cliente = {
    id: '',
    nome: '',
    cpf: '',
    telefone: ''
  }

  nome = new FormControl('', [Validators.minLength(5)])
  cpf = new FormControl('', [Validators.minLength(11)])
  telefone = new FormControl('', [Validators.minLength(14)])

  constructor(
    private router: Router,
    private service: ClienteService,
    private snack: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  cancel(): void {
    this.router.navigate(['clientes'])
  }

  create(): void {
    this.service.create(this.cliente).subscribe((resposta) => {
      this.router.navigate(['clientes'])
      this.message('Cliente criado com sucesso!')
    }, err => {
      if (err.error.error.match('já cadastrado')) {
        this.message(err.error.error)
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

