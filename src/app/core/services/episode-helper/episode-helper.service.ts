import { computed, inject, Injectable, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { CharactersHandlerStore } from '@core/state/characters/handler/characters-handler.store';
import { EpisodesHandlerStore } from '@core/state/episodes/handler/episodes-handler.store';
import { TextConstant } from '@shared/constants/text.constant';
import { CharacterModel } from '@shared/models/character.model';
import { EpisodeModel } from '@shared/models/episode.model';
import { SnackBarService } from '@shared/ui/atoms/snack-bar/snack-bar.service';
import { CharacterSearchHelperService } from '../character-search-helper/character-search-helper.service';

@Injectable({
  providedIn: 'root'
})
export class EpisodeHelperService {
  #characterSearchHelperService = inject(CharacterSearchHelperService);
  #charactersHandlerStore = inject(CharactersHandlerStore);
  #episodesHandlerStore = inject(EpisodesHandlerStore);
  #snackBarService = inject(SnackBarService);

  characters = this.#charactersHandlerStore.characters;
  charactersLoading = this.#charactersHandlerStore.isLoading;
  charactersErrror = this.#charactersHandlerStore.error;

  episodes = this.#episodesHandlerStore.episodes;
  episodesLoading = this.#episodesHandlerStore.isLoading;
  episodesErrror = this.#episodesHandlerStore.error;

  labels = TextConstant.tableSearch;

  emptyDataMessage = signal(this.labels.initSearch);
  pageIndex = this.#characterSearchHelperService.pageIndex;
  pageSize = this.#characterSearchHelperService.pageSize;
  pageLength = this.#characterSearchHelperService.pageLength;

  isLoading = computed(() => this.episodesLoading() || this.charactersLoading());
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

  displayedColumns = this.#characterSearchHelperService.displayedColumns;

  getIdsToSearch(props: { characterIds: number[], indexFrom: number, indexTo: number }): number[] {
    return this.#characterSearchHelperService.getIdsToSearch(props);
  }

  getTableIndexes(props: { pageSize: number, pageIndex: number }): { indexFrom: number, indexTo: number } {
    return this.#characterSearchHelperService.getTableIndexes(props);
  }

  getCharactersToShow(props: { characters: CharacterModel[], pageSize: number, pageIndex: number }) {
    return this.#characterSearchHelperService.getCharactersToShow(props);
  }

  disableSearchBtn(): boolean {
    return this.isLoading();
  }

  onPage(pageEvent: PageEvent): void {
    this.#characterSearchHelperService.onPage(pageEvent);
  }

  onRowClick(row: CharacterModel): void {
    this.#characterSearchHelperService.onRowClick(row);
  }

  loadCharactersByIds(props: { episodes: EpisodeModel[] }): void {
    const { episodes } = props;
    const charactersUrl = episodes?.flatMap(ep => ep.characters) || [];
    return this.#characterSearchHelperService.loadCharactersByIds({ charactersUrl });
  }

  loadLocationsError(props: { noDataFound: string, snackbarErrorBtn: string }): void {
    const { noDataFound, snackbarErrorBtn } = props;
    const errorMessage = this.episodesErrror ? this.episodesErrror() : undefined;
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

  loadNoCharactersFound(props: { message: string, searchCriteria: string, actionButtonText: string }): void {
    this.#characterSearchHelperService.loadNoCharactersFound(props);
  }

  onDestroy(): void {
    this.#charactersHandlerStore.clearState();
    this.#episodesHandlerStore.clearState();
  }
}
