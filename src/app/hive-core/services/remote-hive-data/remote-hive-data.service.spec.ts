import { TestBed } from "@angular/core/testing";
import { HTTP } from "@ionic-native/http/ngx";
import { RemoteHiveDataService } from "./remote-hive-data.service";

const mockSuccessResponse = (responseData) => {
  return new Promise((resolve) => {
    resolve({ data: responseData });
  });
};

describe("RemoteHiveDataService", () => {
  let service: RemoteHiveDataService;
  let mockHttp: any;

  beforeEach(() => {
    mockHttp = jasmine.createSpyObj("http", ["get", "post"]);
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HTTP, useValue: mockHttp }],
    });
    service = TestBed.inject(RemoteHiveDataService);
  });

  it("should get the hive collection", (done) => {
    const mockHive1 = { id: "12345" };
    const mockHive2 = { id: "67890" };
    const mockResp = [mockHive1, mockHive2];
    mockHttp.get.and.returnValue(mockSuccessResponse(mockResp));
    service.getHives().subscribe((hives) => {
      expect(hives).toEqual(mockResp);
      done();
    });
  });

  it("should get the hive", (done) => {
    const mockHive = { id: "12345" };
    mockHttp.get.and.returnValue(mockSuccessResponse(mockHive));
    service.getHive("12345").subscribe((hive) => {
      expect(hive).toEqual(mockHive);
      done();
    });
  });

  it("should create the hive", (done) => {
    const mockHive = { id: "12345" };
    mockHttp.post.and.returnValue(mockSuccessResponse(mockHive));
    service.createHive(mockHive).subscribe((hive) => {
      expect(hive).toEqual(mockHive);
      done();
    });
  });

  it("should get the hive part", (done) => {
    const mockHivePart = { id: "12345" };
    mockHttp.get.and.returnValue(mockSuccessResponse(mockHivePart));
    service.getBody("12345").subscribe((hivePart) => {
      expect(hivePart).toEqual(mockHivePart);
      done();
    });
  });

  it("should get the frame", (done) => {
    const mockFrame = { id: "12345" };
    mockHttp.get.and.returnValue(mockSuccessResponse(mockFrame));
    service.getFrame("12345").subscribe((frame) => {
      expect(frame).toEqual(mockFrame);
      done();
    });
  });
});
