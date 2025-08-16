import { inject, Injectable } from '@angular/core';
import { take } from 'rxjs';
import { EpisodeReducerStore } from '../reducer/episodes-reducer.store';

@Injectable({
  providedIn: 'root'
})
export class EpisodesHandlerStore {
  #store = inject(EpisodeReducerStore);

  episodes = this.#store.episodes;
  isLoading = this.#store.isLoading;
  error = this.#store.error;

  loadEpisodes(props: { episodeName: string }): void {
    const { episodeName } = props;
    this.#store.loadEpisodes({ episodeName }).pipe(take(1)).subscribe();
  }

  clearState(): void {
    this.#store.clearState();
  }
  
}
