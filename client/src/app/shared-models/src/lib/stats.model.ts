import { RouteStation } from "./route-station.model";

export interface Stats  {
  totalMinutes: number;
  totalStations: number;
  mostUsedStartLocation: string;
  mostVisitedStation: string;
}
