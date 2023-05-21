import {Departure} from "./departure-model";
import {RouteStation} from "./route-station.model";

export interface ExitStationTrain  {
  departure: Departure;
  routeStation: RouteStation;
}

export interface Station {
  UICCode: string;
  namen: {
    lang: string;
    middel: string;
    kort: string;
  };
}
