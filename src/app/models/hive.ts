import { HiveBody } from './hive-body';
import { ModelBase } from './model-base';

export interface Hive extends ModelBase {
    label?: string;
    parts?: HiveBody[];
    photo?: Photo;
    notes?: Note[];
}
