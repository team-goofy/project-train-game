import {Departure} from "./departure-model";
import {RouteStation} from "./route-station.model";

export interface ExitStationTrainModel  {
  departure: Departure
  routeStation: RouteStation;
}
