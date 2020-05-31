import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GrocerySelectListComponent } from './grocery-select-list.component';

describe('GrocerySelectListComponent', () => {
  let component: GrocerySelectListComponent;
  let fixture: ComponentFixture<GrocerySelectListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrocerySelectListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GrocerySelectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
