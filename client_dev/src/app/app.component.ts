import { Component } from '@angular/core';
import { TestService } from './services/test.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'panel';

  constructor(
    private _testService: TestService,
    private _router: Router
  ) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call ngOnChanges.
    //Add 'implements OnInit' to the class.
    const token = localStorage.getItem('token');
    if ((!token)) {
      localStorage.clear();
      this._router.navigate(['/']);
      return; //Salir si el token no existe
    }

    this._testService.verificar_token(token).subscribe(
      response => {

      },
      error => {
        /* localStorage.clear();
        this._router.navigate(['/']); */
        this.cerrarSesion();
      }
    );
  }

  cerrarSesion(): void {
    // Limpia el localStorage
    localStorage.clear();

    // Notifica al usuario que la sesión se cerró
    $.notify('Se cerró la sesión por seguridad.', {
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

    // Redirige al usuario a la página de inicio de sesión
    this._router.navigate(['/']);
  }
}
