import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserForm } from '../../forms/user-form/user-form';
import { UserService } from '../../../services/user-service';
import { UserModel } from '../../../models/user.model';

@Component({
  selector: 'app-user-dashboard',
  imports: [
    AsyncPipe,
    CommonModule,
    FormsModule,
    UserForm
  ],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.scss'
})
export class UserDashboard implements OnInit {
  private _users = new BehaviorSubject<UserModel[]>([]);
  private _filteredUsers = new BehaviorSubject<UserModel[]>([]);

  users$: Observable<UserModel[]> = this._users.asObservable();
  filteredUsers$: Observable<UserModel[]> = this._filteredUsers.asObservable();

  actionType: 'add' | 'edit' | 'delete' | null = null;
  showForm: boolean = false;
  selectedUser: UserModel | null = null;
  searchTerm: string = '';

  constructor(
    private userService: UserService
  ) {}

  handleAction(type: 'add' | 'edit' | 'delete', user?: UserModel) {
    this.actionType = type;
    this.showForm = true;

    if (type === 'edit' || type === 'delete') {
      if (user) {
        this.selectedUser = user;
      }

      if (type === 'delete') {
        this.deleteUser(user!);
      }
    }
  }

  cancelAction(): void {
    this.actionType = null;
    this.showForm = false;
    this.selectedUser = null;
  }

  columns = [
    { field: 'idUser', header: 'ID' },
    { field: 'name', header: 'Usuario' },
    { field: 'role', header: 'Rol' },
    { field: 'active', header: 'Estado' }
  ];

  ngOnInit(): void {
    this.loadUsers();
  }

  createUser(userData: { [key: string]: string; }) {
    this.showForm = false;
    this.actionType = null;
    console.log(userData);

    const newUser: UserModel = {
      idUser: null,
      name: userData['name'],
      pass: userData['pass'],
      active: true,
      role: userData['role']
    };

    console.log(newUser);
    this.userService.createUser(newUser).subscribe({
      next: (created) => {
        console.info('Nuevo usuario creado exitosamente');
        this.loadUsers();
      },
      error: (err) => {
        console.error(`Error al crear usuario: ${newUser.name}`, err);
      }
    });
  }

  updateUser(userData: { [key: string]: string | boolean; }) {
    this.showForm = false;
    this.actionType = null;
    console.log(userData);

    if (!this.selectedUser) {
      console.error('No hay usuario seleccionado para actualizar');
      return;
    }

    const updatedUser: UserModel = {
      idUser: this.selectedUser.idUser,
      name: userData['name'] as string,
      pass: userData['pass'] ? userData['pass'] as string : this.selectedUser.pass,
      role: userData['role'] as string,
      active: userData['active'] as boolean
    };

    console.log(updatedUser);
    this.userService.updateUser(updatedUser).subscribe({
      next: (result) => {
        console.info('Usuario actualizado exitosamente');
        this.loadUsers();
        this.selectedUser = null;
      },
      error: (err) => {
        console.error(`Error al actualizar usuario: ${updatedUser.name}`, err);
      }
    });
  }

  deleteUser(user: UserModel): void {
    if (confirm(`¿Está seguro de eliminar el usuario ${user.name}?`)) {
      this.userService.deleteUser(user.idUser!).subscribe({
        next: () => {
          console.info('Usuario eliminado con éxito');
          this.loadUsers();
          this.cancelAction();
        },
        error: (err) => {
          console.error('Error al eliminar usuario', err);
        }
      });
    } else {
      this.cancelAction();
    }
  }

  filterUsers(): void {
    if (!this.searchTerm.trim()) {
      this._filteredUsers.next(this._users.getValue());
      return;
    }

    const filtered = this._users.getValue().filter(user =>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    this._filteredUsers.next(filtered);
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this._users.next(data);
        this._filteredUsers.next(data);
        console.info("Usuarios cargados:", data);
      },
      error: (err) => {
        console.error(`Error al cargar usuarios: ${err}`);
      }
    });
  }
}
