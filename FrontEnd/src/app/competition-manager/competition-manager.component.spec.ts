import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionManagerComponent } from './competition-manager.component';

describe('CompetitionManagerComponent', () => {
  let component: CompetitionManagerComponent;
  let fixture: ComponentFixture<CompetitionManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompetitionManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetitionManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
