import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ColaboradorService } from 'src/app/services/colaborador.service';
declare var $: any;

@Component({
  selector: 'app-create-colaborador',
  templateUrl: './create-colaborador.component.html',
  styleUrls: ['./create-colaborador.component.css']
})
export class CreateColaboradorComponent implements OnInit {

  public colaborador: any = {
    genero: '',
    rol: '',
    pais: '',
    telefono: '' // Asegúrate de que este campo esté aquí para poder enlazarlo
  };
  public btn_registrar = false;
  public token: any = localStorage.getItem('token');

  constructor(
    private _colaboradorService: ColaboradorService,
    private _router: Router
  ) { }

  ngOnInit(): void {
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

  registrar(registroForm: any) {

    if (registroForm.valid) {
      this.btn_registrar = true;
      this._colaboradorService.registro_colaborador_admin(this.colaborador, this.token).subscribe(
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
            this.btn_registrar = false;
          } else {
            this.btn_registrar = false;
            $.notify('Se registró correctamente el colaborador.', {
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
