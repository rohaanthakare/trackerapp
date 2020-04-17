import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

export class SelectEmitObj {
  field: any;
  value: any;
}

@Component({
  selector: 'app-model-form',
  templateUrl: './model-form.component.html',
  styleUrls: ['./model-form.component.scss'],
})
export class ModelFormComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() formTitle: string;
  @Output() formSubmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectChange: EventEmitter<any> = new EventEmitter<any>();
  formFields = [];
  allFormFields = [];
  constructor() { }

  ngOnInit() {}

  setFormFields(fields) {
    fields.forEach((f) => {
      if (!this.formGroup.controls[f.name]) {
        this.formGroup.controls[f.name] = f.control;
      }
    });
    this.formFields = fields;
    this.allFormFields = fields;
  }

  saveForm() {
    this.formFields.forEach((field) => {
      if (field.type === 'select' && field.control.value) {
        const selectedData = field.dataSource.find((d) => d[field.valueField] === field.control.value);
        this.formGroup.value[field.name] = selectedData;
      }
    });

    for (const key in this.formGroup.value) {
      if (key) {
        const fieldToCheck = this.formFields.find((f) => f.name === key);
        if (!fieldToCheck) {
          delete this.formGroup.value[key];
        }
      }
    }
    this.formSubmit.emit(null);
  }

  setValues(modelValue) {
    for (const key of Object.keys(modelValue)) {
      this.formFields.forEach((currentField) => {
        if (currentField.type === 'select' && currentField.name === key) {
          const fieldValue = modelValue[key];
          currentField.control.setValue(fieldValue[currentField.valueField]);
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

  resetForm() {
    this.formGroup.reset();
    Object.keys(this.formGroup.controls).forEach(key => {
      this.formGroup.get(key).setErrors(null) ;
    });
  }

  addField(fieldName) {
    const fieldToCheck = this.formFields.find((config) => config.name === fieldName);
    if (!fieldToCheck) {
      const fieldToAdd = this.allFormFields.find((config) => config.name === fieldName);
      const fieldIndex = this.allFormFields.findIndex((config) => config.name === fieldName);
      this.formFields.splice(fieldIndex, 0, fieldToAdd);
      this.formGroup.controls[fieldName] = fieldToAdd.control;
    }
  }

  removeField(fieldName) {
    this.formFields = this.formFields.filter((field) => field.name !== fieldName);
    delete this.formGroup.value.fieldName;
    delete this.formGroup.controls[fieldName];
  }

  updateSelectFieldDataScource(fieldName, newData) {
    const field = this.formFields.find((c) => c.name === fieldName);
    field.dataScource = [];
    field.dataScource = newData;
  }

  selectValueChanged(fieldConfig) {
    const emitVal: SelectEmitObj = new SelectEmitObj();
    emitVal.field = fieldConfig;
    if (fieldConfig.control.value) {
      if (fieldConfig.type === 'multiselect') {
        const valArr = [];
        fieldConfig.control.value.forEach((v) => {
          const emitValue = fieldConfig.dataSource.find((d) => d[fieldConfig.valueField] === v);
          valArr.push(emitValue);
        });
        emitVal.value = valArr;
      } else {
        emitVal.value = fieldConfig.dataSource.find((d) => d[fieldConfig.valueField] === fieldConfig.control.value);
      }
    }
    this.selectChange.emit(emitVal);
  }
}
