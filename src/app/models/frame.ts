import { ModelBase } from './model-base';

export interface Frame extends ModelBase {
    label?: string;
    notes?: Note[];
}
