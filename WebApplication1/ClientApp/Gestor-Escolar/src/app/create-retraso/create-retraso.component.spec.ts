import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRetrasoComponent } from './create-retraso.component';

describe('CreateRetrasoComponent', () => {
  let component: CreateRetrasoComponent;
  let fixture: ComponentFixture<CreateRetrasoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRetrasoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRetrasoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
