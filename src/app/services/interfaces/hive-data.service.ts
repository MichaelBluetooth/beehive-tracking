import { Observable } from 'rxjs';
import { Frame } from 'src/app/models/frame';
import { Hive } from 'src/app/models/hive';
import { HiveBody } from 'src/app/models/hive-body';

export interface IHiveDataService {
    getHive(id: string): Observable<Hive>;
    getBody(id: string): Observable<HiveBody>;
    getFrame(id: string): Observable<Frame>;
}
