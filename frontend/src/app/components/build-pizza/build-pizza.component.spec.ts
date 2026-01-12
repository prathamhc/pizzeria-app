import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildPizzaComponent } from './build-pizza.component';

describe('BuildPizzaComponent', () => {
  let component: BuildPizzaComponent;
  let fixture: ComponentFixture<BuildPizzaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuildPizzaComponent]
    });
    fixture = TestBed.createComponent(BuildPizzaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
