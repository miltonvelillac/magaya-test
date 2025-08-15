import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocationHandlerStore } from '@core/state/location/handler/location-handler.store';
import { TextConstant } from '@shared/constants/text.constant';
import { GlobalSpinnerComponent } from '@shared/ui/atoms/global-spinner/global-spinner.component';
import { TableComponent } from '@shared/ui/atoms/table/table.component';
import { SearchFieldComponent } from '@shared/ui/molecules/search-field/search-field.component';

export enum DimensionsFormNamesEnum {
  dimension = 'dimension'
}

@Component({
  selector: 'app-dimensions',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GlobalSpinnerComponent,
    TableComponent,
    SearchFieldComponent
  ],
  templateUrl: './dimensions.component.html',
  styleUrl: './dimensions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DimensionsComponent {
  #locationHandlerStore = inject(LocationHandlerStore);

  locations = this.#locationHandlerStore.locations;
  isLoading = this.#locationHandlerStore.isLoading;
  errror = this.#locationHandlerStore.error;

  labels = TextConstant.dimension;
  formNames = DimensionsFormNamesEnum;
  form = new FormGroup({
    [this.formNames.dimension]: new FormControl('', [Validators.required])
  });

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];

  ELEMENT_DATA: any[] = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
    { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
    { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
    { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
    { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
    { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
    { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  ];

  constructor() {
    this.getLocations();
    this.setDisableForm();
  }

  disableSearchBtn(): boolean {
    return this.isLoading();
  }

  search(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return
    };
    const { dimension } = this.form.value;

    this.#locationHandlerStore.loadLocationsByDimension({ dimension: dimension || '' });
  }

  private getLocations(): void {
    effect(() => {
      console.log(this.locations())
    })
  }

  private setDisableForm(): void {
    effect(() => {
      this.isLoading() ? this.form.disable() : this.form.enable();
    });
  }
}
