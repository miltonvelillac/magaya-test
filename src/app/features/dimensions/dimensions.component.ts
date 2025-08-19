import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { LocationHelperService } from '@core/services/location-helper/location-helper.service';
import { LocationHandlerStore } from '@core/state/location/handler/location-handler.store';
import { TextConstant } from '@shared/constants/text.constant';
import { DimensionsFormNamesEnum } from '@shared/enums/dimensions-form-names.enum';
import { CharacterModel } from '@shared/models/character.model';
import { SearchTableComponent } from '@shared/ui/organisms/search-table/search-table.component';

@Component({
  selector: 'app-dimensions',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SearchTableComponent
  ],
  templateUrl: './dimensions.component.html',
  styleUrl: './dimensions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DimensionsComponent implements OnDestroy {
  #locationHandlerStore = inject(LocationHandlerStore);
  #locationHelperService = inject(LocationHelperService);

  locations = this.#locationHelperService.locations;
  allLocations = this.#locationHelperService.allLocations;
  locationLoading = this.#locationHelperService.locationLoading;
  locationErrror = this.#locationHelperService.locationErrror;

  characters = this.#locationHelperService.characters;
  charactersLoading = this.#locationHelperService.charactersLoading;
  charactersErrror = this.#locationHelperService.charactersErrror;

  labels = TextConstant.dimension;
  formNames = DimensionsFormNamesEnum;
  form = new FormGroup({
    [this.formNames.dimension]: new FormControl('', [Validators.required])
  });

  emptyDataMessage = this.#locationHelperService.emptyDataMessage;
  pageIndex = this.#locationHelperService.pageIndex;
  pageSize = this.#locationHelperService.pageSize;
  pageLength = this.#locationHelperService.pageLength;
  displayedColumns = this.#locationHelperService.displayedColumns;

  charactersData = this.#locationHelperService.charactersData;
  isLoading = this.#locationHelperService.isLoading;

  optionsToSearch = this.#locationHandlerStore.allDimensions;

  constructor() {
    this.loadAllLocations();
    this.loadCharactersByIds();
    this.loadLocationsError();
    this.setDisableForm();
  }

  ngOnDestroy(): void {
    this.#locationHelperService.onDestroy();
  }

  disableSearchBtn(): boolean {
    return this.#locationHelperService.disableSearchBtn();
  }

  search(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return
    };
    this.#locationHelperService.searchLocation();

    const { dimension } = this.form.value;
    this.#locationHandlerStore.loadLocationsByFilters({ dimension: dimension || '' });
  }

  onPage(pageEvent: PageEvent): void {
    this.#locationHelperService.onPage(pageEvent);
  }

  onRowClick(row: CharacterModel): void {
    this.#locationHelperService.onRowClick(row);
  }

  private loadAllLocations(): void {
    effect(() => {
      this.#locationHandlerStore.loadAllLocations();
    });
  }

  private loadCharactersByIds(): void {
    effect(() => this.#locationHelperService.loadCharactersByIds({ locations: this.locations() }));
  }

  private loadLocationsError(): void {
    effect(() => this.#locationHelperService.loadLocationsError(
      { noDataFound: this.labels.noDataFound, snackbarErrorBtn: this.labels.snackbarErrorBtn }
    ));
  };

  private setDisableForm(): void {
    effect(() => this.#locationHelperService.setDisableForm({ form: this.form }));
  }
}
