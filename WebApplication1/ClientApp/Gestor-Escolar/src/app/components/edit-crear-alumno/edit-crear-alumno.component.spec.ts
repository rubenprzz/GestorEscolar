import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCrearAlumnoComponent } from './edit-crear-alumno.component';

describe('EditCrearAlumnoComponent', () => {
  let component: EditCrearAlumnoComponent;
  let fixture: ComponentFixture<EditCrearAlumnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCrearAlumnoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCrearAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
