import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HivePageComponent } from './hive-page.component';

describe('HivePageComponent', () => {
  let component: HivePageComponent;
  let fixture: ComponentFixture<HivePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HivePageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HivePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
