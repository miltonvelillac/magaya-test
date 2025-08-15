import { Injectable } from '@angular/core';
import { CharacterApiRequestModel } from '@shared/models/character-api-request.model';
import { CharacterModel } from '@shared/models/character.model';

@Injectable({
  providedIn: 'root'
})
export class CharactersMapper {

  getRequest(props: { ids: number[] }): CharacterApiRequestModel {
    const { ids } = props;
    return { ids };
  }

  getResponseByCharacterIds(response: any[]): CharacterModel[] {
    return response?.map(resp => ({
      id: resp.id,
      name: resp.name,
      status: resp.status,
      species: resp.species,
      gender: resp.gender,
      origin: resp.origin,
      location: resp.location,
      image: resp.image,
      episode: resp.episode,
      url: resp.url,
      created: resp.created,
      type: resp.type,
    })) || [];
  }

  /**
   * NOTE: we get the characters by idex because the user can goes to the last page so we need to fill the array with the correct positions
   * @param props 
   * @returns 
   */
  getCharactersByIndex(props: { currentCharacters: CharacterModel[], charactersFromApi: CharacterModel[], indexFrom: number }): CharacterModel[] {
    const { currentCharacters, charactersFromApi, indexFrom } = props;

    const charact: CharacterModel[] = [...currentCharacters];
    let index = indexFrom;
    charactersFromApi.forEach(c => {
      charact[index++] = c;
    });

    return charact;
  }

  getIdsToSearch(props: { currentCharacters: CharacterModel[], characterIds: number[] }): number[] {
    const { currentCharacters, characterIds } = props;
    let idsToSearch: number[] = [];
    if (currentCharacters.length === 0) idsToSearch = characterIds;
    else {
      for (const characterId of characterIds) {
        let characterAlreadyExist = false;
        for (const character of currentCharacters) {
          if (character?.id === characterId) {
            characterAlreadyExist = true;
            break;
          }
        }
        if (!characterAlreadyExist) idsToSearch.push(characterId);
      }
    }

    return idsToSearch;
  }
}
