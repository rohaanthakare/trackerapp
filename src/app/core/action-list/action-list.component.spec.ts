import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ActionListComponent } from './action-list.component';

describe('ActionListComponent', () => {
  let component: ActionListComponent;
  let fixture: ComponentFixture<ActionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ActionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
