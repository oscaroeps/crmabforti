import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
declare var $: any;

@Component({
  selector: 'app-index-cliente',
  templateUrl: './index-cliente.component.html',
  styleUrls: ['./index-cliente.component.css']
})
export class IndexClienteComponent implements OnInit {

  public token = localStorage.getItem('token');
  public clientes: Array<any> = [];
  public clientes_const: Array<any> = [];

  public filtro = '';
  public page = 1;
  public pageSize = 25;

  public load_estado = false;
  public load_data = false;

  constructor(
    private _clienteService: ClienteService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.load_data = true;
    this._route.queryParams.subscribe(
      (params: Params) => {
        this.filtro = params.filter || ''; // Si no hay filtro, carga todos los clientes
        this.init_data();
      }
    );
  }

  init_data() {
    if (this.filtro) {
      this.filtrar(); // Si hay un filtro, filtrar los datos
    } else {
      this.load_data = true;
      this._clienteService.listar_clientes_admin(null, this.token).subscribe(
        response => {
          this.clientes = response.data;
          this.load_data = false;
        },
        error => {
          this.load_data = false;
        }
      );
    }
  }

  filtrar() {
    if (this.filtro) {
      this.load_data = true;
      this._clienteService.listar_clientes_admin(this.filtro, this.token).subscribe(
        response => {
          this.clientes = response.data;
          this.load_data = false;
        }
      );
    } else {
      this.init_data(); // Si el filtro es vacío, carga todos los datos
    }
  }

  set_state(id: any, estado: any) {
    this.load_estado = true;
    this._clienteService.cambiar_estado_cliente_admin(id, { estado: estado }, this.token).subscribe(
      response => {
        this.load_estado = false;
        $('#delete-' + id).modal('hide');
        this.filtrar();
      }
    );
  }
}
