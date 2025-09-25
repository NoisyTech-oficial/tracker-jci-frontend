import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessesObtainedRoutingModule } from './processes-obtained-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProcessesObtainedComponent } from './processes-obtained.component';
import { SeeMoreInformationsProcessesObtainedModalComponent } from './components/see-more-informations-processes-obtained-modal/see-more-informations-processes-obtained-modal.component';
import { FiltersProcessesObtainedComponent } from './components/filters-processes-obtained/filters-processes-obtained.component';
import { TableProcessesObtainedComponent } from './components/table-processes-obtained/table-processes-obtained.component';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  declarations: [ProcessesObtainedComponent, SeeMoreInformationsProcessesObtainedModalComponent, FiltersProcessesObtainedComponent, TableProcessesObtainedComponent],
  imports: [
    ProcessesObtainedRoutingModule,
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    FormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    SharedModule,
    OverlayModule,
  ],
  providers: [provideNgxMask()],
})
export class ProcessesObtainedModule { }
