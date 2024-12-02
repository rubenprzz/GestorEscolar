import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAlumnoComponent } from './view-alumno.component';

describe('ViewAlumnoComponent', () => {
  let component: ViewAlumnoComponent;
  let fixture: ComponentFixture<ViewAlumnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAlumnoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
