import { Frame } from './frame';
import { ModelBase } from './model-base';

export interface HiveBody extends ModelBase {
    label?: string;
    frames?: Frame[];
    type: 'Hive Body' | 'Super';
    notes?: Note[];
}
