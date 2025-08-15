import { ChangeDetectionStrategy, Component, effect, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocationHandlerStore } from '@core/state/location/handler/location-handler.store';
import { TextConstant } from '@shared/constants/text.constant';
import { GlobalSpinnerComponent } from '@shared/ui/atoms/global-spinner/global-spinner.component';
import { InputTextComponent } from '@shared/ui/atoms/input-text/input-text.component';

export enum DimensionsFormNamesEnum {
  dimension = 'dimension'
}

@Component({
  selector: 'app-dimensions',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputTextComponent,
    GlobalSpinnerComponent
  ],
  templateUrl: './dimensions.component.html',
  styleUrl: './dimensions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DimensionsComponent implements OnInit {
  #locationHandlerStore = inject(LocationHandlerStore);

  locations = this.#locationHandlerStore.locations;
  isLoading = this.#locationHandlerStore.isLoading;
  errror = this.#locationHandlerStore.error;

  labels = TextConstant.dimension;
  formNames = DimensionsFormNamesEnum;
  form = new FormGroup({
    [this.formNames.dimension]: new FormControl('', [ Validators.required ])
  });

  constructor() {
    effect(() => {
      console.log(this.locations())
    })
  }
  
  ngOnInit(): void {
    this.#locationHandlerStore.loadLocationsByDimension({ dimension: 'C-137' });
  }
}
