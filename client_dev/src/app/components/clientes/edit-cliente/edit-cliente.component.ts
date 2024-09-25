import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from 'src/app/services/cliente.service';
declare var $: any;

@Component({
  selector: 'app-edit-cliente',
  templateUrl: './edit-cliente.component.html',
  styleUrls: ['./edit-cliente.component.css']
})
export class EditClienteComponent implements OnInit {

  public cliente: any = {
    nombres: '',  // Inicializar como cadena vacía
    apellidos: '',  // Inicializar como cadena vacía
    genero: '',
    rol: '',
    pais: '',
    telefono: '' // Asegúrate de que este campo esté aquí para poder enlazarlo
  };
  public btn_actualizar = false;
  public token: any = localStorage.getItem('token');
  public id = '';
  public load_data = true;
  public data = false;

  constructor(
    private _route: ActivatedRoute,
    private _clienteService: ClienteService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this._route.params.subscribe(params => {
      this.id = params['id'];
      this.load_data = true;
      this._clienteService.obtener_datos_cliente_admin(this.id, this.token).subscribe(
        response => {
          if (response.data != undefined) {
            this.cliente = response.data;
            this.data = true;
            this.load_data = false;
          } else {
            this.data = false;
            this.load_data = false;
          }
        }
      );
    });
  }

  onPhoneInput(event: any): void {
    let input = event.target.value.replace(/[^0-9]/g, ''); // Solo permitir números
    let formattedInput = '';

    // Iteramos sobre los números y agregamos los separadores en las posiciones adecuadas
    for (let i = 0; i < input.length; i++) {
      formattedInput += input[i];

      // Agregar guiones después de cada segundo y sexto dígito
      if (i === 1 || i === 5 || i === 11 || i === 15) {
        formattedInput += '-';
      }

      // Agregar punto y coma después de cada décimo dígito (nuevo número)
      if (i === 9 && input.length > 10) {
        formattedInput += ' ; ';
      }
    }

    // Limitar la longitud del campo a 33 caracteres (tres números)
    if (formattedInput.length > 27) {
      formattedInput = formattedInput.substring(0, 27);
    }

    // Asignamos el valor formateado al modelo
    this.cliente.telefono = formattedInput;
  }

  actualizar(actualizarForm: any) {
    if (actualizarForm.valid) {
      this.btn_actualizar = true;

      // Asegurar que los campos nombres y apellidos tengan algún valor, aunque sea vacío
      this.cliente.nombres = this.cliente.nombres || '';
      this.cliente.apellidos = this.cliente.apellidos || '';

      this._clienteService.editar_cliente_admin(this.id, this.cliente, this.token).subscribe(
        response => {
          if (response.data == undefined) {
            $.notify(response.message, {
              type: 'danger',
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
            this.btn_actualizar = false;
          } else {
            this.btn_actualizar = false;
            $.notify('Se actualizó el cliente.', {
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
            this._router.navigate(['/cliente']);
          }
        }
      );
    } else {
      $.notify('Complete correctamente el formulario', {
        type: 'danger',
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
    }
  }

}
