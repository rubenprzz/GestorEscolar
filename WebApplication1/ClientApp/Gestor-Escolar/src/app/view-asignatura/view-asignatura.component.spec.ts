import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAsignaturaComponent } from './view-asignatura.component';

describe('ViewAsignaturaComponent', () => {
  let component: ViewAsignaturaComponent;
  let fixture: ComponentFixture<ViewAsignaturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAsignaturaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAsignaturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
