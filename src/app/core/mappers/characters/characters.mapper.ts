import { Injectable } from '@angular/core';
import { CharacterApiRequestModel } from '@shared/models/character-api-request.model';
import { CharacterModel } from '@shared/models/character.model';

@Injectable({
  providedIn: 'root'
})
export class CharactersMapper {

  getRequest(props: { ids: string[] }): CharacterApiRequestModel {
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
}
