import { RouteStation } from "./route-station.model";

export interface Departure  {
  direction: string;
  name: string;
  plannedDateTime: string;
  actualTrack: string;
  trainCategory: string;
  routeStations: RouteStation[];
  departureStatus: string;

}
