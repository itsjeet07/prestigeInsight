import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlantHeadComponent } from './plant-head.component';

describe('PlantHeadComponent', () => {
  let component: PlantHeadComponent;
  let fixture: ComponentFixture<PlantHeadComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantHeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
