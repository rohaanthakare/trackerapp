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
    this.formFields.forEach((field) => {
      if (field.type === 'select' && field.control.value) {
        field.control.setValue(JSON.parse(field.control.value));
      }
    });
    this.formSubmit.emit(null);
  }

  setValues(modelValue) {
    for (const key of Object.keys(modelValue)) {
      this.formFields.forEach((currentField) => {
        if (currentField.type === 'select' && currentField.name === key) {
            currentField.control.setValue(JSON.stringify(modelValue[key]));
        } else {
          if (currentField.name === key && modelValue[key] !== 'null') {
            currentField.control.setValue(modelValue[key]);
          }
        }
      });
    }
  }

  setSelectCmpValue(data) {
    return (data) ? JSON.stringify(data) : data;
  }
}
