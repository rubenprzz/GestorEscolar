import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePadreComponent } from './create-padre.component';

describe('CreatePadreComponent', () => {
  let component: CreatePadreComponent;
  let fixture: ComponentFixture<CreatePadreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePadreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePadreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
