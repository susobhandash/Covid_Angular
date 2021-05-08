import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CowinInfoComponent } from './cowin-info.component';

describe('CowinInfoComponent', () => {
  let component: CowinInfoComponent;
  let fixture: ComponentFixture<CowinInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CowinInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CowinInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
