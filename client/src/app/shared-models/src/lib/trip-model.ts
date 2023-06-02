import { RouteStation } from "./route-station.model";

export interface Trip {
  tripId?: string;
  routeStations: RouteStation[];
  isEnded: boolean;
}
