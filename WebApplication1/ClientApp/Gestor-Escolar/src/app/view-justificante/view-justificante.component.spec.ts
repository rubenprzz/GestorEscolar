import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewJustificanteComponent } from './view-justificante.component';

describe('ViewJustificanteComponent', () => {
  let component: ViewJustificanteComponent;
  let fixture: ComponentFixture<ViewJustificanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewJustificanteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewJustificanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
