import { Injectable } from '@angular/core';
import { CharacterModel } from '@shared/models/character.model';
import { LocationModel } from '@shared/models/location.model';
import { RegexUtils } from '@shared/utils/regex/regex.utils';

@Injectable({
  providedIn: 'root'
})
export class CharacterHelperService {

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

}
