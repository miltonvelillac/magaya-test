import { computed, inject, Injectable, signal } from '@angular/core';
import { CharactersHandlerStore } from '@core/state/characters/handler/characters-handler.store';
import { CharacterModel } from '@shared/models/character.model';
import { LocationModel } from '@shared/models/location.model';
import { RegexUtils } from '@shared/utils/regex/regex.utils';
import { NavigationServiceTsService } from '../navigation/navigation.service.ts.service';
import { PageEvent } from '@angular/material/paginator';
import { LocationHandlerStore } from '@core/state/location/handler/location-handler.store';
import { FormGroup } from '@angular/forms';
import { CharacterColumn } from '@shared/types/character-column.type';
import { TextConstant } from '@shared/constants/text.constant';
import { SnackBarService } from '@shared/ui/atoms/snack-bar/snack-bar.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterHelperService {
  #charactersHandlerStore = inject(CharactersHandlerStore);
  #locationHandlerStore = inject(LocationHandlerStore);
  #navigationServiceTsService = inject(NavigationServiceTsService);
  #snackBarService = inject(SnackBarService);

  characters = this.#charactersHandlerStore.characters;
  charactersLoading = this.#charactersHandlerStore.isLoading;
  charactersErrror = this.#charactersHandlerStore.error;

  locations = this.#locationHandlerStore.locations;
  locationLoading = this.#locationHandlerStore.isLoading;
  locationErrror = this.#locationHandlerStore.error;

  labels = TextConstant.commonDimensionLocation;

  emptyDataMessage = signal(this.labels.initSearch);
  pageIndex = signal(0);
  pageSize = signal(10);
  pageLength = signal(0);

  isLoading = computed(() => this.locationLoading() || this.charactersLoading());
  charactersData = computed(() => {
    const characters = this.getCharactersToShow(
      {
        characters: this.characters(),
        pageIndex: this.pageIndex(),
        pageSize: this.pageSize()
      }
    );
    return characters;
  });

  displayedColumns: CharacterColumn[] = ['id', 'name', 'status', 'species', 'gender'];

  getCharacterIds(props: { locations: LocationModel[] }): number[] {
    const { locations } = props;
    const residentIds: { [key: string]: number } = {};

    locations.forEach(loc => {
      loc.residents.forEach(res => {
        const characterId = RegexUtils.getCharacterIdFromUrl({ url: res });
        if (characterId !== null) {
          residentIds[`${characterId}`] = characterId;
        }
      });
    });
    return Object.values(residentIds);
  }

  getIdsToSearch(props: { characterIds: number[], indexFrom: number, indexTo: number }): number[] {
    const { characterIds, indexFrom, indexTo } = props;
    return characterIds.slice(indexFrom, indexTo);
  }

  getTableIndexes(props: { pageSize: number, pageIndex: number }): { indexFrom: number, indexTo: number } {
    const { pageSize, pageIndex } = props;
    const indexFrom = pageIndex * pageSize;
    const indexTo = indexFrom + pageSize;
    return { indexFrom, indexTo };
  }

  getCharactersToShow(props: { characters: CharacterModel[], pageSize: number, pageIndex: number }) {
    const { characters, pageSize, pageIndex } = props;

    const index = pageIndex * pageSize;
    const indexTo = index + pageSize;
    return characters.slice(index, indexTo);
  }

  disableSearchBtn(): boolean {
    return this.isLoading();
  }

  onPage(pageEvent: PageEvent): void {
    this.pageIndex.update(() => pageEvent.pageIndex);
    this.pageSize.update(() => pageEvent.pageSize);
  }

  onRowClick(row: CharacterModel): void {
    this.#navigationServiceTsService.goToCharacters({ id: row.id });
  }

  loadCharactersByIds(props: { locations: LocationModel[] }): void {
    const { locations } = props;
    const characterIds = this.getCharacterIds({ locations });

    this.#charactersHandlerStore.setCharacterIds({ ids: characterIds });
    this.pageLength.update(() => characterIds?.length || 0);

    if (characterIds?.length > 0) {
      const { indexFrom, indexTo } = this.getTableIndexes({ pageSize: this.pageSize(), pageIndex: this.pageIndex() });
      const idsToSeach = this.getIdsToSearch({ characterIds, indexFrom, indexTo });
      this.#charactersHandlerStore.loadCharactersByIds({ ids: idsToSeach, indexFrom });
    } else {
      this.#charactersHandlerStore.setCharacters({ characters: [] });
    }
  }

  loadLocationsError(props: { noDataFound: string, snackbarErrorBtn: string }): void {
    const { noDataFound, snackbarErrorBtn } = props;
    const errorMessage = this.locationErrror ? this.locationErrror() : undefined;
    if (!errorMessage) return;
    console.error(errorMessage?.messageFromApi);
    this.emptyDataMessage.update(() => noDataFound);
    this.#snackBarService.openErrorSnackBar({ message: errorMessage?.message || '', actionButtonText: snackbarErrorBtn });
  };

  setDisableForm(props: { form: FormGroup }): void {
    const { form } = props;
    this.isLoading() ? form.disable() : form.enable();
  }

  searchLocation(): void {
    this.#charactersHandlerStore.clearState();
    this.pageIndex.update(() => 0);
  }

  onDestroy(): void {
    this.#charactersHandlerStore.clearState();
    this.#locationHandlerStore.clearState();
  }
}
