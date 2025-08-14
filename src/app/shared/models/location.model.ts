export interface LocationModel {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[]; // character urls
  url: string;
  created: string;     // ISO date
}
