import { Component, HostListener, OnInit } from '@angular/core';
import { TestService } from 'src/app/services/test.service';
declare var KTLayoutAside: any;
declare var KTLayoutHeaderMenu: any;
declare var KTLayoutHeaderTopbar: any;
declare var $: any;

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css']
})
export class TopComponent implements OnInit {

  public user: any = {};
  public background = '';
  public showLogout = false; // Propiedad para controlar la visibilidad del botón de cerrar sesión
  public isSmallScreen: boolean = false; // Nueva propiedad para el tamaño de la pantalla

  constructor(
    private _testService: TestService
  ) {
    let str_user = localStorage.getItem('user');
    this.user = str_user ? JSON.parse(str_user) : null;
    this.init_config();
    this.checkScreenSize(); // Verifica el tamaño de la pantalla al cargar
  }

  ngOnInit(): void {
    setTimeout(() => {
      KTLayoutAside.init('kt_aside');
      KTLayoutHeaderMenu.init('kt_header_menu', 'kt_header_menu_wrapper');
      KTLayoutHeaderTopbar.init('kt_header_mobile_topbar_toggle');
    }, 50);
  }

  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize(); // Llama a este método cuando la ventana se redimensiona
  }

  private checkScreenSize() {
    this.isSmallScreen = window.innerWidth <= 991.98;
  }

  logout() {
    localStorage.clear();
    window.location.reload();
  }

  init_config() {
    this._testService.obtener_configuracion_general(localStorage.getItem('token')).subscribe(
      response => {
        this.background = response.data.background;
      }
    );
  }

  toggleLogout() {
    this.showLogout = !this.showLogout; // Alternar el estado de visibilidad del botón de cerrar sesión
  }
}
