import { ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { CharacterHelperService } from '@core/services/character-helper/character-helper.service';
import { NavigationServiceTsService } from '@core/services/navigation/navigation.service.ts.service';
import { CharactersHandlerStore } from '@core/state/characters/handler/characters-handler.store';
import { LocationHandlerStore } from '@core/state/location/handler/location-handler.store';
import { TextConstant } from '@shared/constants/text.constant';
import { LocationsFormNamesEnum } from '@shared/enums/locations-form-names.enum';
import { CharacterModel } from '@shared/models/character.model';
import { CharacterColumn } from '@shared/types/character-column.type';
import { GlobalSpinnerComponent } from '@shared/ui/atoms/global-spinner/global-spinner.component';
import { SnackBarService } from '@shared/ui/atoms/snack-bar/snack-bar.service';
import { SearchFieldComponent } from '@shared/ui/molecules/search-field/search-field.component';
import { TableComponent } from '@shared/ui/molecules/table/table.component';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    GlobalSpinnerComponent,
    TableComponent,
    SearchFieldComponent
  ],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationsComponent implements OnDestroy {
  #locationHandlerStore = inject(LocationHandlerStore);
  #charactersHandlerStore = inject(CharactersHandlerStore);
  #characterHelperService = inject(CharacterHelperService);
  #navigationServiceTsService = inject(NavigationServiceTsService);
  #snackBarService = inject(SnackBarService);

  locations = this.#locationHandlerStore.locations;
  locationLoading = this.#locationHandlerStore.isLoading;
  locationErrror = this.#locationHandlerStore.error;

  characters = this.#charactersHandlerStore.characters;
  charactersLoading = this.#charactersHandlerStore.isLoading;
  charactersErrror = this.#charactersHandlerStore.error;

  labels = TextConstant.location;
  formNames = LocationsFormNamesEnum;
  form = new FormGroup({
    [this.formNames.location]: new FormControl('', [Validators.required])
  });

  emptyDataMessage = signal(this.labels.initSearch);
  pageIndex = signal(0);
  pageSize = signal(10);
  pageLength = signal(0);
  displayedColumns: CharacterColumn[] = ['id', 'name', 'status', 'species', 'gender'];

  charactersData = computed(() => {
    const characters = this.#characterHelperService.getCharactersToShow(
      {
        characters: this.characters(),
        pageIndex: this.pageIndex(),
        pageSize: this.pageSize()
      }
    );
    return characters;
  });
  isLoading = computed(() => this.locationLoading() || this.charactersLoading());

  constructor() {
    this.loadCharactersByIds();
    this.loadLocationsError();
    this.setDisableForm();
  }

  ngOnDestroy(): void {
    this.#charactersHandlerStore.clearState();
    this.#locationHandlerStore.clearState();
  }

  disableSearchBtn(): boolean {
    return this.isLoading();
  }

  search(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return
    };
    this.#charactersHandlerStore.clearState();
    this.pageIndex.update(() => 0);
    const { location } = this.form.value;

    this.#locationHandlerStore.loadLocationsByFilters({ location: location || '' });
  }

  onPage(pageEvent: PageEvent): void {
    this.pageIndex.update(() => pageEvent.pageIndex);
    this.pageSize.update(() => pageEvent.pageSize);
  }

  onRowClick(row: CharacterModel): void {
    this.#navigationServiceTsService.goToCharacters({ id: row.id });
  }

  private loadCharactersByIds(): void {
    effect(() => {
      const locations = this.locations();
      const characterIds = this.#characterHelperService.getCharacterIds({ locations });

      this.#charactersHandlerStore.setCharacterIds({ ids: characterIds });
      this.pageLength.update(() => characterIds?.length || 0);

      if (characterIds?.length > 0) {
        const { indexFrom, indexTo } = this.#characterHelperService.getTableIndexes({ pageSize: this.pageSize(), pageIndex: this.pageIndex() });
        const idsToSeach = this.#characterHelperService.getIdsToSearch({ characterIds, indexFrom, indexTo });
        this.#charactersHandlerStore.loadCharactersByIds({ ids: idsToSeach, indexFrom });
      } else {
        this.#charactersHandlerStore.setCharacters({ characters: [] });
      }
    });
  }

  private loadLocationsError(): void {
    effect(() => {
      const errorMessage = this.locationErrror ? this.locationErrror() : undefined;
      if(!errorMessage) return;
      console.error(errorMessage?.messageFromApi);
      this.emptyDataMessage.update(() => this.labels.noDataFound);
      this.#snackBarService.openErrorSnackBar({ message: errorMessage?.message || '', actionButtonText: this.labels.snackbarErrorBtn });
    })
  };

  private setDisableForm(): void {
    effect(() => {
      this.isLoading() ? this.form.disable() : this.form.enable();
    });
  }

}
