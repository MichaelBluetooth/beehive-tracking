import { Photo } from './photo';
import { ModelBase } from './model-base';

export interface Note extends ModelBase {
    date: any;
    details?: string;
    pests?: string[];
    photo?: Photo;
    queenSpotted?: boolean;
    swarmCells?: boolean;
    queenCells?: boolean;
    supersedureCells?: boolean;
    eggs?: boolean;
    larva?: boolean;
    brood?: boolean;
    activityLevel?: 'Low' | 'Medium' | 'High' | 'N/A';
    orientationFlights?: boolean;
}
