import { CharacterGenderType } from "@shared/types/character-gender.type";
import { CharacterStatusType } from "@shared/types/character-status.type";
import { LocationRefModel } from "./location-ref.model";

export interface CharacterModel {
  id: number;
  name: string;
  status: CharacterStatusType;
  species: string;
  gender: CharacterGenderType;
  origin: LocationRefModel; // reference (name + url)
  location: LocationRefModel;
  image: string;          // URL image
  episode: string[];      // URLs episodes
  url: string;            // URL character
  created: string;        // ISO date string
  type?: string;
}
