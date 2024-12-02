import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrasoComponent } from './retraso.component';

describe('RetrasoComponent', () => {
  let component: RetrasoComponent;
  let fixture: ComponentFixture<RetrasoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetrasoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetrasoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
