import { ConnectedPosition } from '@angular/cdk/overlay';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Banks } from 'src/app/shared/interfaces/banks.interface';
import { Cep } from 'src/app/shared/interfaces/cep.interface';

@Component({
  selector: 'app-filters-processes-obtained',
  templateUrl: './filters-processes-obtained.component.html',
  styleUrls: ['./filters-processes-obtained.component.scss']
})
export class FiltersProcessesObtainedComponent {  
  @Output() filtersSelected = new EventEmitter<string>();
  @Output() exportClicked = new EventEmitter<any>();
  
  @Input() filterForm!: FormGroup;
  @Input() processesObtained: boolean = false;

  banks: Banks[] = [];
  filteredBanks: Banks[] = [...this.banks];
  searchBank: string = '';

  stateAndCities: Cep = {};
  selectedState: string = '';
  stateCity: string[] = [];
  filteredCities: string[] = [];

  constructor(private fb: FormBuilder) {
    this.startForm();
  }

  startForm() {
    this.filterForm = this.fb.group({
      bank: [[]],
      minValue: [null],
      maxValue: [null],
      city: [[]],
      state: [[]],
      processNumber: [''],
    });
  }

  filterByProcessNumber() {
    const value = this.filterForm.get('processNumber')?.value?.toLowerCase().trim();
    this.filtersSelected.emit(value);
  }

  resetFilters() {
    this.filterForm.reset();
  }

  getCities(): string[] {
    const cities = Object.keys(this.stateAndCities);
    return cities;
  }

  hasFilterApplied(): boolean {
    const formValues = this.filterForm.value;

    const hasFilters = Object.values(formValues).some(value => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value !== null && value !== '';
    });

    return hasFilters;
  }

  export() {
    this.exportClicked.emit();
  }
  
}
