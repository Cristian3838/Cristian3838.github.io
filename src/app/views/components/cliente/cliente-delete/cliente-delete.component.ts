import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cliente-delete',
  templateUrl: './cliente-delete.component.html',
  styleUrls: ['./cliente-delete.component.css']
})
export class ClienteDeleteComponent implements OnInit {

  id_cli = ''

  cliente: Cliente = {
    id: '',
    nome: '',
    cpf: '',
    telefone: ''
  }

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

   delete(): void{
    this.service.delete(this.id_cli).subscribe(resposta => {
    this.router.navigate(['clientes'])
    this.message('Cliente deletado com sucesso!')
    }, err =>{
      if(err.error.error.match('possui ordens de serviço')){
        this.message(err.error.error);
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
}
