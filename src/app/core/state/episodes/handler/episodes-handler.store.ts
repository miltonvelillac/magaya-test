import { inject, Injectable } from '@angular/core';
import { take } from 'rxjs';
import { EpisodeReducerStore } from '../reducer/episodes-reducer.store';

@Injectable({
  providedIn: 'root'
})
export class EpisodesHandlerStore {
  #store = inject(EpisodeReducerStore);

  episodes = this.#store.episodes;
  allEpisodes = this.#store.allEpisodes;
  isLoading = this.#store.isLoading;
  error = this.#store.error;

  loaAlldEpisodes(): void {
    this.#store.loaAlldEpisodes().pipe(take(1)).subscribe();
  }

  loadEpisodes(props: { episodeName: string }): void {
    const { episodeName } = props;
    this.#store.loadEpisodes({ episodeName }).pipe(take(1)).subscribe();
  }

  clearState(): void {
    this.#store.clearState();
  }

}
