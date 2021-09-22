import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GuageComponent } from './guage.component';

describe('RadarComponent', () => {
  let component: GuageComponent;
  let fixture: ComponentFixture<GuageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GuageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
