import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAsistenciaComponent } from './view-asistencia.component';

describe('ViewAsistenciaComponent', () => {
  let component: ViewAsistenciaComponent;
  let fixture: ComponentFixture<ViewAsistenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAsistenciaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
