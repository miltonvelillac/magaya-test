import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { LocationHelperService } from '@core/services/location-helper/location-helper.service';
import { LocationHandlerStore } from '@core/state/location/handler/location-handler.store';
import { TextConstant } from '@shared/constants/text.constant';
import { LocationsFormNamesEnum } from '@shared/enums/locations-form-names.enum';
import { CharacterModel } from '@shared/models/character.model';
import { SearchTableComponent } from '@shared/ui/organisms/search-table/search-table.component';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SearchTableComponent
  ],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationsComponent implements OnDestroy {
  #locationHandlerStore = inject(LocationHandlerStore);
  #characterHelperService = inject(LocationHelperService);

  locations = this.#characterHelperService.locations;
  locationLoading = this.#characterHelperService.locationLoading;
  locationErrror = this.#characterHelperService.locationErrror;

  characters = this.#characterHelperService.characters;
  charactersLoading = this.#characterHelperService.charactersLoading;
  charactersErrror = this.#characterHelperService.charactersErrror;

  labels = TextConstant.location;
  formNames = LocationsFormNamesEnum;
  form = new FormGroup({
    [this.formNames.location]: new FormControl('', [Validators.required])
  });

  emptyDataMessage = this.#characterHelperService.emptyDataMessage;
  pageIndex = this.#characterHelperService.pageIndex;
  pageSize = this.#characterHelperService.pageSize;
  pageLength = this.#characterHelperService.pageLength;
  displayedColumns = this.#characterHelperService.displayedColumns;

  charactersData = this.#characterHelperService.charactersData;
  isLoading = this.#characterHelperService.isLoading;

  constructor() {
    this.loadCharactersByIds();
    this.loadLocationsError();
    this.setDisableForm();
  }

  ngOnDestroy(): void {
    this.#characterHelperService.onDestroy();
  }

  disableSearchBtn(): boolean {
    return this.#characterHelperService.disableSearchBtn();
  }

  search(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return
    };
    this.#characterHelperService.searchLocation();
    const { location } = this.form.value;

    this.#locationHandlerStore.loadLocationsByFilters({ location: location || '' });
  }

  onPage(pageEvent: PageEvent): void {
    this.#characterHelperService.onPage(pageEvent);
  }

  onRowClick(row: CharacterModel): void {
    this.#characterHelperService.onRowClick(row);
  }

  private loadCharactersByIds(): void {
    effect(() => this.#characterHelperService.loadCharactersByIds({ locations: this.locations() }));
  }

  private loadLocationsError(): void {
    effect(() => this.#characterHelperService.loadLocationsError(
      { noDataFound: this.labels.noDataFound, snackbarErrorBtn: this.labels.snackbarErrorBtn }
    ));
  };

  private setDisableForm(): void {
    effect(() => this.#characterHelperService.setDisableForm({ form: this.form }));
  }

}
