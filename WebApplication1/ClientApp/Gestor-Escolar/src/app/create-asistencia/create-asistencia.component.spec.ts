import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAsistenciaComponent } from './create-asistencia.component';

describe('CreateAsistenciaComponent', () => {
  let component: CreateAsistenciaComponent;
  let fixture: ComponentFixture<CreateAsistenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAsistenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
