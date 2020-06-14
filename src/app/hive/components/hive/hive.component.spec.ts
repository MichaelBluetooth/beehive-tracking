import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HiveComponent } from './hive.component';

describe('HiveComponent', () => {
  let component: HiveComponent;
  let fixture: ComponentFixture<HiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HiveComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
