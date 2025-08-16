export interface EpisodeModel {
  id: number;
  name: string;          // ex: "Pilot"
  airDate: string;      // ex: "December 2, 2013"
  episode: string;       // ex: "S01E01"
  characters: string[];  // URLs to /api/character/:id
  url: string;           // URL episode
  created: string;       // ISO date string
}
