import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRetrasoComponent } from './view-retraso.component';

describe('ViewRetrasoComponent', () => {
  let component: ViewRetrasoComponent;
  let fixture: ComponentFixture<ViewRetrasoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRetrasoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRetrasoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
