import { Component, inject, OnInit } from '@angular/core';
import { RickAndMortyApiService } from '../../core/api/rick-and-morty/rick-and-morty.api.service';

@Component({
  selector: 'app-dimensions',
  standalone: true,
  imports: [],
  templateUrl: './dimensions.component.html',
  styleUrl: './dimensions.component.scss'
})
export class DimensionsComponent implements OnInit {
  #rickAndMortyService = inject(RickAndMortyApiService);
  
  ngOnInit(): void {
    this.#rickAndMortyService.getLocationsByDimension({ dimension: 'C-137' }).subscribe(
      response => console.log(response)
    );
  }
}
