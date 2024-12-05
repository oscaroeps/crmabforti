import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
declare var $: any;

@Component({
  selector: 'app-create-producto',
  templateUrl: './create-producto.component.html',
  styleUrls: ['./create-producto.component.css']
})
export class CreateProductoComponent implements OnInit {
  public producto: any = {
    tipo: '',
    categoria: ''
  };
  public portada: any = undefined;
  public str_portada: any = 'assets/white.jpg';
  public categorias: Array<any> = [];
  public token = localStorage.getItem('token');
  public load_btn = false;
  public user: any = {};
  constructor(
    private _productoService: ProductoService,
    private _router: Router
  ) {
    let str_user = localStorage.getItem('user');
    this.user = str_user ? JSON.parse(str_user) : null;
  }

  ngOnInit(): void {
    setTimeout(() => {
      $('.selectpicker').selectpicker();
    }, 50);
    this.init_categorias();
  }

  fileEventChange(event: any): void {

    var file: any;

    if (event.target.files && event.target.files[0]) {
      file = <File>event.target.files[0];


      if (file.size <= 2000000) {
        if (file.type == 'image/jpeg' || file.type == 'image/png' || file.type == 'image/webp' || file.type == 'image/jpg') {
          this.portada = file;
          this.producto.portada = this.portada;

          const reader = new FileReader();
          reader.onload = e => this.str_portada = reader.result;
          reader.readAsDataURL(file);

        } else {
          $.notify('Sólo se permite la selección de imagen.', {
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
          this.portada = undefined;
        }
      } else {
        $.notify('La imagen no debe superar los 2MB.', {
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
        this.portada = undefined;
      }
    }
  }

  init_categorias() {
    this._productoService.obtener_configuraciones().subscribe(
      response => {
        this.categorias = response.categorias;
        setTimeout(() => {
          $('.selectpicker').selectpicker('refresh');
        }, 50);
      }
    );
  }

  crear() {
    if (!this.producto.titulo) {
      $.notify('Debe ingresar el nombre del producto.', {
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
    } else if (!this.producto.titulo) {
      $.notify('Debe seleccionar la categoría del producto.', {
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
    } else if (!this.producto.tipo) {
      $.notify('Debe seleccionar el tipo de producto.', {
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
    } else if (!this.producto.tipo_variedad) {
      $.notify('Debe ingresar el tipo de variedad.', {
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
    } else if (!this.producto.descripcion) {
      $.notify('Debe ingresar la descripción del producto.', {
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
    } else if (this.portada == undefined) {
      $.notify('Seleccione la imagen de portada.', {
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
      this.load_btn = true;
      this._productoService.crear_producto_admin(this.producto, this.token).subscribe(
        response => {
          if (response.data != undefined) {
            this.load_btn = false;
            $.notify('Se registró correctamente el producto.', {
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
            // Agregar retraso antes de redirigir al quitarlo resolver los errores que salen en la consola
            setTimeout(() => {
              this._router.navigate(['/productos']);
            }, 1500); // 1500 milisegundos = 1.5 segundos
          } else {
            this.load_btn = false;
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
          }
        },
        error => {
          this.load_btn = false;
          $.notify('Error en el servidor. Intente más tarde.', {
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
      );
    }
  }
}
