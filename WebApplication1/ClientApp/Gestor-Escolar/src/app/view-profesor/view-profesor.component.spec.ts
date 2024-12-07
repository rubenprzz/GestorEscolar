import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProfesorComponent } from './view-profesor.component';

describe('ViewProfesorComponent', () => {
  let component: ViewProfesorComponent;
  let fixture: ComponentFixture<ViewProfesorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewProfesorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewProfesorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
