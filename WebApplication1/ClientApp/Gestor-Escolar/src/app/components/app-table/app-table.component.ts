import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import {CommonModule, NgForOf, NgSwitch, NgSwitchCase} from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { FileUploadModule } from 'primeng/fileupload';
import { ChipsModule } from 'primeng/chips';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { MenuItem } from 'primeng/api';
import { SpeedDialModule } from 'primeng/speeddial';
import { DialogModule } from 'primeng/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import {FormComponent} from '../form/form.component';
import {GenericCrudService} from '../../generic-crud.service';
import {StyleClassModule} from 'primeng/styleclass';
import {MenuComponent} from '../../menubar/menubar.component';
import {environment} from '../../../environment';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {ConfirmDialogModule} from 'primeng/confirmdialog';

@Component({
  selector: 'app-table',
  templateUrl: './app-table.component.html',
  styleUrls: ['./app-table.component.css'],
  imports: [
    ButtonModule,
    RatingModule,
    NgSwitch,
    TableModule,
    ToolbarModule,
    FileUploadModule,
    NgSwitchCase,
    NgForOf,
    ChipsModule,
    ToastModule,
    MessageModule,
    SpeedDialModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    FormComponent,
    CommonModule,
    StyleClassModule,
    MenuComponent,
    ConfirmDialogModule
  ],
  standalone: true,
  styles: [
    `
    `
  ]
})
export class AppTableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() columns: any[] = [];
  @Input() globalFilterFields: string[] = [];
  @Input() rows: number = 10;
  @Input() rowsPerPageOptions: number[] = [10, 25, 50];
  @Input() tableStyle: any = { 'min-width': '75rem', 'background-color':'#053f7c' ,'border-radius': '20px' };
  @Input() apiEndpoint: string = '';
  @Output() onEdit = new EventEmitter<any>();  // Emitir evento de edición
  @Output() onDelete = new EventEmitter<any>(); // Emitir evento de eliminación
  @Output() onAdd = new EventEmitter<void>();
  @Output() onView = new EventEmitter<any>();
  formGroup!: FormGroup;
  items: MenuItem[] | null = null;
  selectedItems: any[] = [];
  displayDialog: boolean = false;
  formFields: any[] = [];
  selectedItem: any | null = null;
  protected readonly apiUrl = environment.apiUrl
  constructor(private readonly crudService: GenericCrudService, private readonly fb: FormBuilder,private sanitizer: DomSanitizer) {

  }
  getImageUrl(urlFoto: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(urlFoto);
  }


  ngOnInit() {
    this.items = [
      {
        label: 'View',
        icon: 'pi pi-fw pi-search',
        command: () => this.viewItem(this.selectedItems[0])
      },
      {
        label: 'Delete',
        icon: 'pi pi-fw pi-trash',
        command: () => this.deleteSelectedItems()
      },
      {
        label: 'Create',
        icon: 'pi pi-fw pi-plus',
        command: () => this.openNew()
      }
    ];

    this.formFields = this.columns.map((col) => ({
      name: col.field,
      label: col.header,
      type: 'text', // Cambia según la lógica necesaria
    }));

    // Inicializa el formulario
    this.initForm();
  }

  initForm() {
    const group: any = {};
    this.formFields.forEach((field) => {
      group[field.name] = ['', Validators.required];
    });
    this.formGroup = this.fb.group(group);
  }

  openNew() {
    this.onAdd.emit();
    this.displayDialog = true;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  deleteSelectedItems() {
    this.selectedItems.forEach(item => {
      const index = this.data.indexOf(item);
      if (index > -1) {
        this.data.splice(index, 1);
      }
    });
    this.selectedItems = [];
    console.log('Selected items deleted');
  }


  editItem(item: any) {
    this.onEdit.emit(item);
  }

  deleteItem(item: any) {
    this.onDelete.emit(item);
  }

  viewItem(item: any) {
    console.log('View item', item);
    this.onView.emit(item);
  }

  onSubmit() {
    if (this.formGroup.invalid) return;

    const formData = this.formGroup.value;

    if (this.selectedItem) {
      const index = this.data.findIndex((d) => d.id === this.selectedItem.id);
      if (index !== -1) {
        this.data[index] = { ...this.selectedItem, ...formData };
      }
    } else {
      this.data.push({ ...formData, id: this.data.length + 1 });
    }

    this.displayDialog = false;
  }


  private getFieldType(field: string): string {
    // Aquí puedes implementar la lógica para determinar el tipo de campo
    // basado en el nombre del campo o en alguna otra lógica de tu aplicación
    return 'text'; // Por defecto, todos los campos serán de tipo texto
  }
}
