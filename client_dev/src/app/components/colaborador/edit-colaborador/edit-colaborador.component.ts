import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ColaboradorService } from 'src/app/services/colaborador.service';
declare var $: any;

@Component({
  selector: 'app-edit-colaborador',
  templateUrl: './edit-colaborador.component.html',
  styleUrls: ['./edit-colaborador.component.css']
})
export class EditColaboradorComponent implements OnInit {

  public id = '';
  public colaborador: any = {
    genero: '',
    rol: '',
    pais: '',
    telefono: ''
  };
  public btn_actualizar = false;
  public token: any = localStorage.getItem('token');
  public load_data = false;
  public data = false;

  constructor(
    private _colaboradorService: ColaboradorService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._route.params.subscribe(
      params => {

        this.id = params['id'];
        this.load_data = true;
        this._colaboradorService.obtener_datos_colaborador_admin(this.id, this.token).subscribe(
          response => {
            if (response.data != undefined) {
              this.colaborador = response.data;
              this.data = true;
              this.load_data = false;
            } else {
              this.data = false;
              this.load_data = false;

            }
          }
        );
      }
    );
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
    this.colaborador.telefono = formattedInput;
}

// Validar solo números en tiempo real
validateNumberInput(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;

    // Si el carácter no es un número (charCode entre 48 y 57 corresponde a '0'-'9'), evitar la entrada
    if (charCode < 48 || charCode > 57) {
        event.preventDefault();
    }
}

  actualizar(actualizarForm: any) {
    if (actualizarForm.valid) {
      this.btn_actualizar = true;
      this._colaboradorService.editar_colaborador_admin(this.id, this.colaborador, this.token).subscribe(
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
            $.notify('Se actualizó el colaborador.', {
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
            this._router.navigate(['/colaborador']);
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
