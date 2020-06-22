import { HiveBody } from './hive-body';
import { ModelBase } from './model-base';
import { Note } from './note';

export interface Hive extends ModelBase {
    label?: string;
    parts?: HiveBody[];
    photo?: Photo;
    notes?: Note[];
    plants?: string[];
    queenLastSpotted?: Date;
}
