import {Departure} from "./departure-model";
import {RouteStation} from "./route-station.model";

export interface ExitStationTrain  {
  departure: Departure;
  exitStation: RouteStation;
}
