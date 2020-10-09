import { Observable } from 'rxjs';
import { Frame } from '../../models/frame';
import { Hive } from '../../models/hive';
import { HiveBody } from '../../models/hive-body';

export interface IHiveDataService {
    getHive(id: string): Observable<Hive>;
    getBody(id: string): Observable<HiveBody>;
    getFrame(id: string): Observable<Frame>;
}
