import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AssetViewComponent } from './asset-view.component';

describe('AssetViewComponent', () => {
  let component: AssetViewComponent;
  let fixture: ComponentFixture<AssetViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
