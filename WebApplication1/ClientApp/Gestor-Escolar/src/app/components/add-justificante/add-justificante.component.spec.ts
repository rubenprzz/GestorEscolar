import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJustificanteComponent } from './add-justificante.component';

describe('AddJustificanteComponent', () => {
  let component: AddJustificanteComponent;
  let fixture: ComponentFixture<AddJustificanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddJustificanteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddJustificanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
