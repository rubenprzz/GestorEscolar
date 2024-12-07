import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPadreComponent } from './view-padre.component';

describe('ViewPadreComponent', () => {
  let component: ViewPadreComponent;
  let fixture: ComponentFixture<ViewPadreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPadreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPadreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
