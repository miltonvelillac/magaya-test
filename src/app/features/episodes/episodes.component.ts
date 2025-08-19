import { ChangeDetectionStrategy, Component, computed, effect, inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { EpisodeHelperService } from '@core/services/episode-helper/episode-helper.service';
import { EpisodesHandlerStore } from '@core/state/episodes/handler/episodes-handler.store';
import { TextConstant } from '@shared/constants/text.constant';
import { EpisodesFormNamesEnum } from '@shared/enums/episodes-form-names.enum';
import { CharacterModel } from '@shared/models/character.model';
import { SearchTableComponent } from '@shared/ui/organisms/search-table/search-table.component';

@Component({
  selector: 'app-episodes',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SearchTableComponent
  ],
  templateUrl: './episodes.component.html',
  styleUrl: './episodes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EpisodesComponent implements OnDestroy {
  #episodesHandlerStore = inject(EpisodesHandlerStore);
  #episodeHelperService = inject(EpisodeHelperService);

  episodes = this.#episodeHelperService.episodes;
  episodesLoading = this.#episodeHelperService.episodesLoading;
  episodesErrror = this.#episodeHelperService.episodesErrror;

  characters = this.#episodeHelperService.characters;
  charactersLoading = this.#episodeHelperService.charactersLoading;
  charactersErrror = this.#episodeHelperService.charactersErrror;

  labels = TextConstant.episodes;
  formNames = EpisodesFormNamesEnum;
  form = new FormGroup({
    [this.formNames.episodeName]: new FormControl('', [Validators.required])
  });

  emptyDataMessage = this.#episodeHelperService.emptyDataMessage;
  pageIndex = this.#episodeHelperService.pageIndex;
  pageSize = this.#episodeHelperService.pageSize;
  pageLength = this.#episodeHelperService.pageLength;
  displayedColumns = this.#episodeHelperService.displayedColumns;

  charactersData = this.#episodeHelperService.charactersData;
  isLoading = this.#episodeHelperService.isLoading;

  optionsToSearch = computed(() => this.#episodesHandlerStore.allEpisodes()?.map(episode => episode.name));

  constructor() {
    this.loadAllLocations();
    this.loadCharactersByIds();
    this.loadLocationsError();
    this.listenCharacters();
    this.setDisableForm();
  }

  ngOnDestroy(): void {
    this.#episodeHelperService.onDestroy();
  }

  disableSearchBtn(): boolean {
    return this.#episodeHelperService.disableSearchBtn();
  }

  search(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return
    };
    this.#episodeHelperService.searchLocation();

    const { episodeName } = this.form.value;
    this.#episodesHandlerStore.loadEpisodes({ episodeName: episodeName || '' });
  }

  onPage(pageEvent: PageEvent): void {
    this.#episodeHelperService.onPage(pageEvent);
  }

  onRowClick(row: CharacterModel): void {
    this.#episodeHelperService.onRowClick(row);
  }

  private loadAllLocations(): void {
    effect(() => {
      this.#episodesHandlerStore.loaAlldEpisodes();
    });
  }

  private loadCharactersByIds(): void {
    effect(() => this.#episodeHelperService.loadCharactersByIds({ episodes: this.episodes() }));
  }

  private loadLocationsError(): void {
    effect(() => this.#episodeHelperService.loadLocationsError(
      { noDataFound: this.labels.noDataFound, snackbarErrorBtn: this.labels.snackbarErrorBtn }
    ));
  };

  private listenCharacters(): void {
    effect(() => {
      const characters = this.characters();
      const searchCriteria = this.form.controls[this.formNames.episodeName]?.value || '';
      if(searchCriteria && characters?.length === 0 && !this.charactersLoading()) {
        this.#episodeHelperService.loadNoCharactersFound({ searchCriteria, message: this.labels.noCharactersFoundInfoMessage, actionButtonText: this.labels.snackbarErrorBtn });
      }
    })
  }

  private setDisableForm(): void {
    effect(() => this.#episodeHelperService.setDisableForm({ form: this.form }));
  }
}
