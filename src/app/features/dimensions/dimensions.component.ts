import { Component, effect, inject, OnInit } from '@angular/core';
import { LocationHandlerStore } from '@core/state/location/handler/location-handler.store';

@Component({
  selector: 'app-dimensions',
  standalone: true,
  imports: [],
  templateUrl: './dimensions.component.html',
  styleUrl: './dimensions.component.scss'
})
export class DimensionsComponent implements OnInit {
  #locationHandlerStore = inject(LocationHandlerStore);

  locations = this.#locationHandlerStore.locations;
  isLoading = this.#locationHandlerStore.isLoading;

  constructor() {
    effect(() => {
      console.log(this.locations())
    })
  }
  
  ngOnInit(): void {
    this.#locationHandlerStore.loadLocationsByDimension({ dimension: 'C-137' });
  }
}
