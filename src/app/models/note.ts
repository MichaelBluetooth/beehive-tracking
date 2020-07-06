import { Photo } from './photo';
import { ModelBase } from './model-base';

export interface Note extends ModelBase {
    date: any;
    details?: string;
    pests?: string[];
    photo?: Photo;
    queenSpotted?: boolean;
}
