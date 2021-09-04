import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AreaViewComponent } from './area-view.component';

describe('AreaViewComponent', () => {
  let component: AreaViewComponent;
  let fixture: ComponentFixture<AreaViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AreaViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
