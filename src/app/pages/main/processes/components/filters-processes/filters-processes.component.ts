import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { Banks } from 'src/app/shared/interfaces/banks.interface';
import { Cep } from 'src/app/shared/interfaces/cep.interface';

@Component({
  selector: 'app-filters-processes',
  templateUrl: './filters-processes.component.html',
  styleUrls: ['./filters-processes.component.scss']
})
export class FiltersProcessesComponent {

  @Input() set resetFilter(data: boolean) {
    if (data) this.resetFilters();
  }

  @Output() filtersSelected = new EventEmitter<FormGroup>();

  filterForm!: FormGroup;

  banks: Banks[] = [];
  filteredBanks: Banks[] = [...this.banks];
  searchBank: string = '';

  stateAndCities: Cep = {};
  selectedState: string = '';
  stateCity: string[] = [];
  filteredCities: string[] = [];

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {
    this.startForm();
  }

  ngOnInit(): void {
    this.filterForm.valueChanges
    .pipe(debounceTime(300)) // espera 300ms sem digitar
    .subscribe(() => {
      this.filtersSelected.emit(this.filterForm);
    });
  }

  startForm() {
    this.filterForm = this.fb.group({
      bank: [[]],
      minValue: [null],
      maxValue: [null],
      city: [[]],
      state: [[]]
    });
  }

  getState(): string[] {
    return Object.keys(this.stateAndCities);
  }

  updateCities(stateSelected: string): void {
    this.selectedState = stateSelected;
    this.stateCity = this.stateAndCities[stateSelected] || [];
    this.filteredCities = [...this.stateCity]; // Copia todas as cidades

    if (!stateSelected) {
      this.filterForm.get('city')?.setValue([]);
    }
  }

  resetFilters() {
    this.filterForm.reset();
  }

  filterBanks(event: Event) {
    const input = event.target as HTMLInputElement;
    const searchTerm = input.value.toLowerCase().trim();

    this.filteredBanks = this.banks.filter(bank =>
      bank.name.toLowerCase().includes(searchTerm)
    );
  }

  filterCities(event: Event): void {
    const input = event.target as HTMLInputElement;
    const searchTerm = input.value.toLowerCase().trim();

    this.filteredCities = this.stateCity.filter(city =>
      city.toLowerCase().includes(searchTerm)
    );
  }

}
