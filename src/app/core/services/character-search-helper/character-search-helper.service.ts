import { inject, Injectable, signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { CharactersHandlerStore } from '@core/state/characters/handler/characters-handler.store';
import { CharacterModel } from '@shared/models/character.model';
import { RegexUtils } from '@shared/utils/regex/regex.utils';
import { NavigationServiceTsService } from '../navigation/navigation.service.ts.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterSearchHelperService {
  #charactersHandlerStore = inject(CharactersHandlerStore);
  #navigationServiceTsService = inject(NavigationServiceTsService);

  pageIndex = signal(0);
  pageSize = signal(10);
  pageLength = signal(0);

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

  onPage(pageEvent: PageEvent): void {
    this.pageIndex.update(() => pageEvent.pageIndex);
    this.pageSize.update(() => pageEvent.pageSize);
  }

  onRowClick(row: CharacterModel): void {
    this.#navigationServiceTsService.goToCharacters({ id: row.id });
  }

  loadCharactersByIds(props: { charactersUrl: string[] }): void {
    const { charactersUrl } = props;
    const characterIds = this.getCharacterIds({ charactersUrl });

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

  private getCharacterIds(props: { charactersUrl: string[] }): number[] {
    const { charactersUrl } = props;
    const residentIds: { [key: string]: number } = {};

    charactersUrl.forEach(res => {
      const characterId = RegexUtils.getCharacterIdFromUrl({ url: res });
      if (characterId !== null) {
        residentIds[`${characterId}`] = characterId;
      }
    });
    return Object.values(residentIds);
  }
}
