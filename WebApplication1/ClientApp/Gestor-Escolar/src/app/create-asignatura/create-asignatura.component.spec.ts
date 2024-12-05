import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAsignaturaComponent } from './create-asignatura.component';

describe('CreateAsignaturaComponent', () => {
  let component: CreateAsignaturaComponent;
  let fixture: ComponentFixture<CreateAsignaturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAsignaturaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAsignaturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
