import { Frame } from './frame';
import { Hive } from './hive';
import { ModelBase } from './model-base';
import { Note } from './note';

export interface HiveBody extends ModelBase {
    label?: string;
    frames?: Frame[];
    type?: 'Hive Body' | 'Super';
    notes?: Note[];
    dateAdded?: any;

    hiveId?: string;
    hive?: Hive;
}
