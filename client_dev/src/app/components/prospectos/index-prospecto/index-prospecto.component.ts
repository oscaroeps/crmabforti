import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
declare var $: any;

@Component({
  selector: 'app-index-prospecto',
  templateUrl: './index-prospecto.component.html',
  styleUrls: ['./index-prospecto.component.css']
})
export class IndexProspectoComponent implements OnInit {

  public user: any = {};
  public token = localStorage.getItem('token');
  public clientes: Array<any> = [];
  public clientes_const: Array<any> = [];

  public filtro = '';  // Variable para almacenar el criterio de filtro
  public page = 1;
  public pageSize = 25;

  public load_estado = false;
  public load_data = false;

  constructor(
    private _clienteService: ClienteService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    let str_user = localStorage.getItem('user');
    this.user = str_user ? JSON.parse(str_user) : null;
  }

  ngOnInit(): void {
    this.load_data = true;

    // Verificamos si hay un filtro en los queryParams
    this._route.queryParams.subscribe(
      (params: Params) => {
        this.filtro = params['filter'] || '';  // Asignar el filtro si está presente en la URL
        this.init_data();
      }
    );
  }

  formatPhoneNumber(phone: string): string {
    return phone.split(';').join('<br>');
  }


  // Método que decide si filtrar o cargar todos los prospectos
  init_data() {
    if (this.filtro) {
      this.filtrar();  // Si hay filtro, filtrar los datos
    } else {
      this.load_data = true;
      this._clienteService.listar_clientes_admin(null, this.token).subscribe(
        response => {
          if (this.user.rol === 'Administrador') {
            this.clientes = response.data.filter((cliente: any) => cliente.tipo === 'Prospecto');
            this.load_data = false;
          } else {
            this.clientes = response.data.filter((cliente: any) => cliente.tipo === 'Prospecto' && cliente.asesor._id === this.user._id);
            this.load_data = false;
          }
        },
        error => {
          this.load_data = false;
          console.error('Error cargando prospectos', error);
        }
      );
    }
  }

  // Filtrar prospectos basados en el criterio de búsqueda
  filtrar() {
    if (this.filtro) {
      this.load_data = true;
      this._clienteService.listar_clientes_admin(this.filtro, this.token).subscribe(
        response => {
          if (this.user.rol === 'Administrador') {
            this.clientes = response.data.filter((cliente: any) => cliente.tipo === 'Prospecto');
            this.load_data = false;
          } else {
            this.clientes = response.data.filter((cliente: any) => cliente.tipo === 'Prospecto' && cliente.asesor._id === this.user._id);
            console.log("Asesor");

            this.load_data = false;
          }
        },
        error => {
          this.load_data = false;
          console.error('Error filtrando prospectos', error);
        }
      );
    } else {
      this.init_data();  // Si no hay filtro, cargar todos los prospectos
    }
  }

  // Método para manejar la actualización de la URL cuando el filtro cambia
  actualizarFiltro() {
    if (this.filtro) {
      // Actualizar la URL con el nuevo filtro
      this._router.navigate([], {
        relativeTo: this._route,
        queryParams: { filter: this.filtro },
        queryParamsHandling: 'merge'  // Mantener otros parámetros en la URL
      });
      this.filtrar();
    } else {
      // Si no hay filtro, eliminarlo de la URL y cargar todos los prospectos
      this._router.navigate([], {
        relativeTo: this._route,
        queryParams: { filter: null },
        queryParamsHandling: 'merge'
      });
      this.init_data();  // Cargar todos los prospectos
    }
  }

  // Cambiar el estado de un prospecto
  set_state(id: any, estado: any) {
    this.load_estado = true;
    this._clienteService.cambiar_estado_cliente_admin(id, { estado: estado }, this.token).subscribe(
      response => {
        this.load_estado = false;
        $('#delete-' + id).modal('hide');
        this.filtrar();
      },
      error => {
        this.load_estado = false;
        console.error('Error cambiando estado', error);
      }
    );
  }

  // Cambiar el tipo de un cliente
  set_tipo(id: any, tipo: any) {
    this.load_estado = true;
    this._clienteService.cambiar_tipo_cliente_admin(id, { tipo: tipo }, this.token).subscribe(
      response => {
        this.load_estado = false;
        $('#tipo-' + id).modal('hide');
        this.filtrar();
      },
      error => {
        this.load_estado = false;
        console.error('Error cambiando tipo', error);
      }
    );
  }

  // Simular el borrado de la base de datos del cliente
  eliminar(id: any, isDeleted: any) {
    this.load_estado = true;
    this._clienteService.cambiar_isDeleted_cliente_admin(id, { isDeleted: isDeleted }, this.token).subscribe(
      response => {
        this.load_estado = false;
        $('#borrar-' + id).modal('hide');
        this.filtrar();
        $.notify('Cliente ${response.nombre} eliminado con éxito', {
          type: 'success',
          spacing: 10,
          timer: 2000,
          placement: {
            from: 'top',
            align: 'right'
          },
          delay: 1000,
          animate: {
            enter: 'animated bounce',
            exit: 'animated bounce'
          }
        });
      },
      error => {
        this.load_estado = false;
        console.error('Error cambiando isDeleted', error);
      }
    );
  }

}
