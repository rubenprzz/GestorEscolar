import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {ButtonDirective} from 'primeng/button';
import {NgForOf, NgIf} from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  standalone: true,
  imports: [
    DialogModule,
    ReactiveFormsModule,
    DropdownModule,
    ButtonDirective,
    NgForOf,
    InputTextModule,
    NgIf
  ],
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {
  @Input() visible: boolean = false;
  @Input() title: string = 'Formulario';
  @Input() fields: any[] = [];
  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private readonly fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.form = this.fb.group({});
    this.fields.forEach(field => {
      this.form.addControl(field.name, this.fb.control(''));
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.save.emit(this.form.value);
    }
  }
  onCancel() {
    this.cancel.emit();
  }
}
