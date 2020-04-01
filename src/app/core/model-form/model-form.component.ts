import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-model-form',
  templateUrl: './model-form.component.html',
  styleUrls: ['./model-form.component.scss'],
})
export class ModelFormComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() formTitle: string;
  @Output() formSubmit: EventEmitter<any> = new EventEmitter<any>();
  formFields = [];
  constructor() { }

  ngOnInit() {}

  setFormFields(fields) {
    this.formFields = fields;
  }

  saveForm() {
    this.formSubmit.emit(null);
  }

  setValues(modelValue) {
    for (const key of Object.keys(modelValue)) {
      this.formFields.forEach((currentField) => {
        if (currentField.name === key && modelValue[key] !== 'null') {
          currentField.control.setValue(modelValue[key]);
        }
      });
    }
  }
}
