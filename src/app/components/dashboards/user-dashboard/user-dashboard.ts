import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserForm } from '../../forms/user-form/user-form';
import { UserService } from '../../../services/user-service';
import { UserModel } from '../../../models/user.model';
import { signal } from '@angular/core';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-user-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    UserForm
  ],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.scss'
})
export class UserDashboard implements OnInit {
  users = signal<UserModel[]>([]);
  filteredUsers = signal<UserModel[]>([]);

  actionType: 'add' | 'edit' | 'delete' | null = null;
  showForm: boolean = false;
  selectedUser: UserModel | null = null;
  searchTerm: string = '';

  constructor(
    private userService: UserService,
    private notificationService: NotificationService
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
        this.notificationService.success('Usuario creado exitosamente');
        this.loadUsers();
      },
      error: (err) => {
        this.notificationService.error('Error al crear usuario');
        console.error(`Error al crear usuario: ${newUser.name}`, err);
      }
    });
  }

  updateUser(userData: { [key: string]: string | boolean; }) {
    this.showForm = false;
    this.actionType = null;
    console.log(userData);

    if (!this.selectedUser) {
      this.notificationService.warning('No hay usuario seleccionado para actualizar');
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
      next: (response) => {
        this.notificationService.success('Usuario actualizado exitosamente');
        this.loadUsers();
        this.selectedUser = null;
      },
      error: (err) => {
        this.notificationService.error('Error al actualizar usuario');
        console.error(`Error al actualizar usuario: ${updatedUser.name}`, err);
      }
    });
  }

  deleteUser(user: UserModel): void {
    if (confirm(`¿Está seguro de eliminar el usuario ${user.name}?`)) {
      this.userService.deleteUser(user.idUser!).subscribe({
        next: () => {
          this.notificationService.success('Usuario eliminado con éxito');
          this.loadUsers();
          this.cancelAction();
        },
        error: (err) => {
          this.notificationService.error('Error al eliminar usuario');
          console.error('Error al eliminar usuario', err);
        }
      });
    } else {
      this.cancelAction();
    }
  }

  filterUsers(): void {
    if (!this.searchTerm.trim()) {
      this.filteredUsers.set(this.users());
      return;
    }
    const filtered = this.users().filter(user =>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.filteredUsers.set(filtered);
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.filteredUsers.set(data);
        this.notificationService.info('Usuarios cargados correctamente');
        console.info("Usuarios cargados:", data);
      },
      error: (err) => {
        this.notificationService.error('Error al cargar usuarios');
        console.error(`Error al cargar usuarios: ${err}`);
      }
    });
  }
}
