import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTableComponent } from './app-table.component';

describe('AppTableComponent', () => {
  let component: AppTableComponent;
  let fixture: ComponentFixture<AppTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
