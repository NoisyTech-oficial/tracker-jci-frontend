import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilComponent } from './perfil.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';
import { MasksService } from 'src/app/shared/masks/masks.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

describe('PerfilComponent', () => {
  let component: PerfilComponent;
  let fixture: ComponentFixture<PerfilComponent>;

  const userDataMock = {
    nome: 'Usuário Teste',
    email: 'teste@example.com',
    documento: '12345678901',
    foto: null
  };

  const userServiceStub = {
    getUserData: jasmine.createSpy('getUserData').and.returnValue(userDataMock),
    putUsuario: jasmine.createSpy('putUsuario').and.returnValue(of({})),
    uploadAvatar: jasmine.createSpy('uploadAvatar').and.returnValue(of({})),
    getUser: jasmine.createSpy('getUser').and.returnValue(of(userDataMock)),
    setUser: jasmine.createSpy('setUser')
  };

  const masksServiceStub = {
    formatDocument: jasmine.createSpy('formatDocument').and.returnValue('123.456.789-01')
  };

  const notificationServiceStub = {
    showMessage: jasmine.createSpy('showMessage')
  };

  const dialogRefStub = {
    afterClosed: () => of(false)
  };

  const matDialogStub = {
    open: jasmine.createSpy('open').and.returnValue(dialogRefStub)
  } as Partial<MatDialog> as MatDialog;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerfilComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatProgressBarModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceStub },
        { provide: MasksService, useValue: masksServiceStub },
        { provide: NotificationService, useValue: notificationServiceStub },
        { provide: MatDialog, useValue: matDialogStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
