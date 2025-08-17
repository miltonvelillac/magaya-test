import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TextConstant } from '@shared/constants/text.constant';
import { CharacterApiRequestModel, CharacterRequestModel } from '@shared/models/character-api-request.model';
import { CharacterModel } from '@shared/models/character.model';
import { ErrorModel } from '@shared/models/error.model';

@Injectable({
  providedIn: 'root'
})
export class CharactersMapper {

  getRequest(props: CharacterRequestModel): CharacterApiRequestModel {
    const { ids, page } = props;
    const idsParams = ids?.join(',') || '';

    const params = new HttpParams({
      fromObject: {
        ...(page ? { page } : {})
      }
    });

    return { ids: idsParams, params };
  }

  getResponseByCharacterIds(response: any[]): CharacterModel[] {
    return response?.map(resp => this.getResponseByOneCharacterId(resp)) || [];
  }

  getResponseByOneCharacterId(response: any): CharacterModel {
    return {
      id: response.id,
      name: response.name,
      status: response.status,
      species: response.species,
      gender: response.gender,
      origin: response.origin,
      location: response.location,
      image: response.image,
      episode: response.episode,
      url: response.url,
      created: response.created,
      type: response.type,
    };
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
    let indexTo = charactersFromApi.length + indexFrom;

    for (let i = indexFrom; i < indexTo; i++) {
      const element = currentCharacters[i];
      if(!!element) index++;
    }

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

  getErrorResponse(props: { error: any, characterSearchIds: number[] }): ErrorModel {
      const { error, characterSearchIds } = props;
      const errorMessage = error?.error?.error;
      const message = `${TextConstant.character.noDataFoundErrorMessage} ${ characterSearchIds?.join(', ') }`;
      return { messageFromApi: errorMessage, message };
    }
}
