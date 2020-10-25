import { ModelBase } from "./model-base";

export interface InspectionDTO extends ModelBase {
  date: any;
  details?: string;
  pests?: string[];
  queenSpotted?: boolean;
  swarmCells?: boolean;
  queenCells?: boolean;
  supersedureCells?: boolean;
  cappedHoney?: boolean;
  eggs?: boolean;
  larva?: boolean;
  brood?: boolean;
  activityLevel?: "Low" | "Medium" | "High" | "N/A";
  orientationFlights?: boolean;

  photoBase64?: string;
}
