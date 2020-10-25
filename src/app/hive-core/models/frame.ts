import { HiveBody } from './hive-body';
import { ModelBase } from './model-base';
import { Note } from './note';

export interface Frame extends ModelBase {
    label?: string;
    notes?: Note[];

    hivePartId?: string;
    hivePart?: HiveBody;
}
