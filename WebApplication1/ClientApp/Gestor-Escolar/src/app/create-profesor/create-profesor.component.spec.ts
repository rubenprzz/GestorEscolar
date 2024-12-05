import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProfesorComponent } from './create-profesor.component';

describe('CreateProfesorComponent', () => {
  let component: CreateProfesorComponent;
  let fixture: ComponentFixture<CreateProfesorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProfesorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateProfesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
