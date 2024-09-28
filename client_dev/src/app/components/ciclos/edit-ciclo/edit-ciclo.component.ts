import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from 'src/app/services/curso.service';
import { ColaboradorService } from 'src/app/services/colaborador.service';
declare var $: any;

@Component({
  selector: 'app-edit-ciclo',
  templateUrl: './edit-ciclo.component.html',
  styleUrls: ['./edit-ciclo.component.css']
})
export class EditCicloComponent implements OnInit {

  public id = '';
  public idciclo = '';
  public ciclo: any = {
    nivel: '',
    sede: ''
  };
  public btn_load = false;
  public str_today = GLOBAL.str_today;
  public data = false;
  public load_data = true;
  public token = localStorage.getItem('token');
  public h_inicio = { hour: 13, minute: 30 };
  public h_fin = { hour: 13, minute: 30 };

  public salon: any = {
    salon: ''
  };
  public dias: Array<any> = [];
  public salones: Array<any> = [];
  public docentes: Array<any> = [];
  public docentes_const: Array<any> = [];
  public load_delete = false;
  public filtro_docente = '';

  public docente_salon: any = {
    ciclo_salon: '',
  };

  public docentes_salones: Array<any> = [];
  public load_delete_ds = false;

  constructor(
    private _route: ActivatedRoute,
    private _cursoService: CursoService,
    private _router: Router,
    private _colaboradorService: ColaboradorService
  ) { }

  ngOnInit(): void {
    this._route.params.subscribe(
      params => {
        this.id = params['id'];
        this.idciclo = params['idciclo'];
        this._cursoService.obtener_datos_curso_ciclo_admin(this.id, this.idciclo, this.token).subscribe(
          response => {

            if (response.data != undefined) {
              this.data = true;
              this.ciclo = response.ciclo;
              this.salones = response.salones;
              this.init_docentes();
              this.init_docentes_salones();
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

  select_day(event: any) {
    let status = event.currentTarget.checked;
    let value = event.target.value;

    if (status) {
      //agregar
      this.dias.push(value);
    } else {
      //eliminar
      let indice = 0;
      this.dias.forEach((element, index) => {
        if (element == value) {
          this.dias.splice(index, 1);
        }
      });

    }
  }

  agregar_ciclo() {
    this.salon.ciclo_curso = this.idciclo;
    if (this.h_inicio || this.h_inicio != undefined || this.h_inicio != null) {
      this.salon.h_inicio = this.h_inicio.hour + ':' + this.h_inicio.minute;
    }
    if (this.h_fin || this.h_fin != undefined || this.h_fin != null) {
      this.salon.h_fin = this.h_fin.hour + ':' + this.h_fin.minute;
    }
    this.salon.f_dias = this.dias;

    if (!this.salon.salon) {
      $.notify('Seleccione el almacén a agregar.', {
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
    } else if (!this.salon.aforo_total) {
      $.notify('Ingrese el aforo del almacén.', {
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
    } else if (this.salon.aforo_total <= 0) {
      $.notify('Ingrese un aforo válido.', {
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
    } else if (!this.salon.h_inicio) {
      $.notify('Ingrese la hora de inicio del almacén.', {
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
    } else if (!this.salon.h_fin) {
      $.notify('Ingrese la hora de fin del almacén.', {
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
    } else if (this.salon.f_dias.length <= 0) {
      $.notify('Seleccione al menos un día.', {
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
    } else {
      this._cursoService.agregar_salon_ciclo_admin(this.salon, this.token).subscribe(
        response => {
          this.dias = [];
          this.salon = {
            salon: ''
          };
          $('.custom-control-input').prop('checked', false);
          this.init_salones();
        }
      );
    }
  }

  init_salones() {
    this._cursoService.obtener_salones_ciclo_admin(this.idciclo, this.token).subscribe(
      response => {
        this.salones = response.data;
      }
    );
  }

  init_docentes() {
    this._colaboradorService.listar_docentes_admin(this.token).subscribe(
      response => {
        this.docentes = response.data;
        this.docentes_const = this.docentes;
      }
    );
  }

  init_docentes_salones() {
    this._cursoService.listar_docentes_salon_admin(this.idciclo, this.token).subscribe(
      response => {
        this.docentes_salones = response.data;
      }
    );
  }

  eliminar_salon(idx: any) {
    this.load_delete = true;
    this._cursoService.eliminar_salon_ciclo_admin(idx, this.token).subscribe(
      response => {
        $.notify('Se eliminó el almacén del ciclo de servicio.', {
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
        $('#delete-' + idx).modal('hide');
        this.load_delete = false;
        this.init_salones();
      }
    );
  }

  actualizar() {
    if (!this.ciclo.nivel) {
      $.notify('Seleccione el nivel del ciclo de servicio.', {
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
    } else if (!this.ciclo.sede) {
      $.notify('Seleccione la sede del ciclo de servicio.', {
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
    } else if (!this.ciclo.f_inicio) {
      $.notify('Ingrese la fecha de inicio de clases.', {
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
    } else if (!this.ciclo.f_fin) {
      $.notify('Ingrese la fecha de fin de clases.', {
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
    } else if (!this.ciclo.precio) {
      $.notify('Ingrese el precio del ciclo de servicio.', {
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
    } else if (this.ciclo.precio <= 0) {
      $.notify('Ingrese un precio válido.', {
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
    } else {
      this._cursoService.editar_ciclo_admin(this.idciclo, this.ciclo, this.token).subscribe(
        response => {
          $.notify('Se actualizó el ciclo de servicio.', {
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
          this._router.navigate(['/cursos/' + this.id + '/ciclo']);
        }
      );
    }
  }

  filtrar_docente() {
    if (this.filtro_docente) {
      //búsqueda
      let term = new RegExp(this.filtro_docente, 'i');
      this.docentes = this.docentes_const.filter(item => term.test(item.nombres) || term.test(item.apellidos) || term.test(item.email) || term.test(item._id));
    } else {
      this.docentes = this.docentes_const;
    }
  }

  seleccionar_docente(item: any) {
    this.docente_salon.colaborador = item._id;
    $('#inp_docente').val(item.fullnames);
    $('#modalDocente').modal('hide');
  }

  vincular_docente_salon() {
    this.docente_salon.ciclo_curso = this.idciclo;
    if (!this.docente_salon.colaborador) {
      $.notify('Seleccione el docente.', {
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
    } else if (!this.docente_salon.ciclo_salon) {
      $.notify('Seleccione el almacén.', {
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
    } else {
      this._cursoService.agregar_docente_salon_admin(this.docente_salon, this.token).subscribe(
        response => {
          $.notify('Se agregó la vinculación.', {
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

          //RESET FORM
          this.docente_salon.colaborador = '';
          this.docente_salon.ciclo_salon = '';
          $('#inp_docente').val('');

          this.init_docentes_salones();
        }
      );
    }
  }

  eliminar_docente_salon(id: any) {
    this.load_delete_ds = true;
    this._cursoService.eliminar_docente_salon_admin(id, this.token).subscribe(
      response => {
        $.notify('Se eliminó el docente del almacén.', {
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
        $('#delete-' + id).modal('hide');
        this.load_delete_ds = false;
        this.init_docentes_salones();
      }
    );
  }

}
