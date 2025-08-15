import { CharacterModel } from "@shared/models/character.model";

export type CharacterColumn = Extract<keyof CharacterModel, string>;
