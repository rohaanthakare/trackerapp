import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DepositFormComponent } from './deposit-form.component';

describe('DepositFormComponent', () => {
  let component: DepositFormComponent;
  let fixture: ComponentFixture<DepositFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepositFormComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DepositFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
