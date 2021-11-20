import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Tecnico } from 'src/app/models/tecnico';
import { TecnicoService } from 'src/app/services/tecnico.service';

@Component({
  selector: 'app-tecnico-delete',
  templateUrl: './tecnico-delete.component.html',
  styleUrls: ['./tecnico-delete.component.css']
})
export class TecnicoDeleteComponent implements OnInit {

  id_tec = ''

  tecnico: Tecnico = {
    id: '',
    nome: '',
    cpf: '',
    telefone: ''
  }

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

  delete(): void{
    this.service.delete(this.id_tec).subscribe(resposta =>{
      this.router.navigate(['tecnicos'])
      this.message('Técnico deletado com sucesso!')

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
    this.router.navigate(['tecnicos'])
  }
}
