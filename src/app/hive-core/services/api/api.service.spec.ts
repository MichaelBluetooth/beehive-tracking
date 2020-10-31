import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HTTP } from '@ionic-native/http/ngx';
import { of } from 'rxjs';
import { LoggerService } from 'src/app/logger/logger.service';
import { NullLogger } from 'src/app/logger/null-logger';
import { AuthenticationService } from '../authentication/authentication.service';

import { ApiService } from './api.service';

fdescribe('ApiService', () => {
  let service: ApiService;
  let mockHTTP: any;
  let mockLogger: any;
  let mockAuth: any;

  beforeEach(() => {
    mockLogger = jasmine.createSpyObj('loggerSvc', ['getLogger']);
    mockLogger.getLogger.and.returnValue(new NullLogger());
    mockAuth = jasmine.createSpyObj('auth', ['getCredentials', 'refresh']);
    mockHTTP = jasmine.createSpyObj('http', ['sendRequest']);
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HTTP, useValue: mockHTTP },
        { provide: LoggerService, useValue: mockLogger },
        { provide: AuthenticationService, useValue: mockAuth }
      ]
    });
    service = TestBed.inject(ApiService);
  });

  describe('When a 401 is received', () => {
    describe('and the refresh token is not expired', () => {
      let firstCall = true;
      const mockSuccessResp = {
        succeeded: 'yay'
      };

      it('refreshes the token, attempts the request again and returns the response', async(() => {
        mockAuth.refresh.and.returnValue(of(true));
        mockHTTP.sendRequest.and.callFake(() => {
          if (firstCall) {
            firstCall = false;
            return Promise.reject({
              status: 401
            });
          } else {
            return Promise.resolve({ data: mockSuccessResp });
          }
        });

        service.get('dummy/url/to/somewhere').subscribe(resp => {
          expect(mockAuth.refresh).toHaveBeenCalled();
          expect(mockHTTP.sendRequest).toHaveBeenCalledTimes(2);
          expect(resp.data).toEqual(mockSuccessResp);
        });
      }));
    });

    describe('and the refresh token is expired', () => {
      const mockErrorResp = { status: 401 };

      it('attempts to refresh the token, returns the error response and does not try the request again',
        async(() => {
          mockAuth.refresh.and.returnValue(of(false));
          mockHTTP.sendRequest.and.callFake(() => {
            return Promise.reject(mockErrorResp);
          });

          service.get('dummy/url/to/somewhere').subscribe(_ => {
            expect(false).toBeTrue();
          },
            resp => {
              expect(mockAuth.refresh).toHaveBeenCalled();
              expect(mockHTTP.sendRequest).toHaveBeenCalledTimes(1);
              expect(resp).toEqual(mockErrorResp);
            }
          );
        }));
    });
  });
});
