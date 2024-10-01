import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-intereses-prospecto',
  templateUrl: './intereses-prospecto.component.html',
  styleUrls: ['./intereses-prospecto.component.css']
})
export class InteresesProspectoComponent implements OnInit {

  public id = '';

  constructor(
    private _route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this._route.params.subscribe(
      params => {

        this.id = params['id'];

      }
    );
  }

}
