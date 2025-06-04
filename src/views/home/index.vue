<script setup lang="ts">
import { ref, computed } from 'vue'
import type { User } from '@/types/user'

const baseApi = 'https://jsonplaceholder.typicode.com';

const isFormVisible = ref<boolean>(false);
const isEdit = ref<boolean>(false);
const selectedUser = ref<User | null>(null);
const name = ref<string>('');
const users = ref<User[]>([]);
const search = ref<string>('');

const cancelForm = (): void => {
  isFormVisible.value = false;
  resetForm();
}

const saveUser = (): void => {
  if (isEdit.value && selectedUser.value) {
    const user = users.value.find((user: User) => user.id === selectedUser.value!.id);
    if (user) {
      user.name = name.value;
    }
    isFormVisible.value = false;
  } else {
    const newUser: Partial<User> = {
      id: Date.now(),
      name: name.value,
      username: name.value.toLowerCase().replace(/\s+/g, ''),
      email: `${name.value.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone: '',
      website: '',
      address: {
        street: '',
        suite: '',
        city: '',
        zipcode: '',
        geo: {
          lat: '',
          lng: ''
        }
      },
      company: {
        name: '',
        catchPhrase: '',
        bs: ''
      }
    };
    users.value.push(newUser as User);
  }
  resetForm();
}

const deleteUser = (id: number): void => {
  users.value = users.value.filter((user: User) => user.id !== id);
}

const resetForm = (): void => {
  name.value = '';
  selectedUser.value = null;
  isEdit.value = false;
  isFormVisible.value = false;
}

const editUser = (user: User): void => {
  selectedUser.value = { ...user };
  name.value = user.name;
  isEdit.value = true;
  isFormVisible.value = true;
}

const filteredUsers = computed((): User[] => {
  return users.value.filter((user: User) => 
    user.name.toLowerCase().includes(search.value.toLowerCase())
  );
})

const fetchUsers = async (): Promise<void> => {
  try {
    const response = await fetch(`${baseApi}/users`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: User[] = await response.json();
    users.value = data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
}

fetchUsers();
</script>

<template>
  <div class="home">
    <div class="input-container">
      <input placeholder="Search..." type="text" v-model="search">
      <button @click="isFormVisible = true">Add</button>
    </div>

    <div class="form-container" v-if="isFormVisible">
      <div>
        <label for="name">Full Name: </label>
        <input type="text" id="name" v-model="name" placeholder="Enter full name">
      </div>
      <div class="form-actions">
        <button @click="cancelForm">Cancel</button>
        <button @click="saveUser" :disabled="!name.trim()">{{ isEdit ? 'Edit' : 'Add' }}</button>
      </div>
    </div>

    <div>
      <ul class="name-list" v-if="filteredUsers.length > 0">
        <li class="name-item" v-for="user in filteredUsers" :key="user.id">
          <div class="user-info">
            <strong>{{ user.name }}</strong>
            <span v-if="user.email" class="user-email">{{ user.email }}</span>
          </div>
          <div class="name-item-actions">
            <button @click="editUser(user)">Edit</button>
            <button @click="deleteUser(user.id)">Delete</button>
          </div>
        </li>
      </ul>
      <div v-else-if="search.trim()" class="no-results">
        No users found matching "{{ search }}"
      </div>
      <div v-else class="loading">
        Loading users...
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-container {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 20px;
}

.input-container input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.input-container button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.input-container button:hover {
  background-color: #0056b3;
}

.name-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.name-item {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border: 1px solid #e9ecef;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-email {
  font-size: 12px;
  color: #6c757d;
}

.name-item-actions {
  display: flex;
  gap: 8px;
}

.name-item-actions button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.name-item-actions button:first-child {
  background-color: #28a745;
  color: white;
  border-color: #28a745;
}

.name-item-actions button:first-child:hover {
  background-color: #218838;
}

.name-item-actions button:last-child {
  background-color: #dc3545;
  color: white;
  border-color: #dc3545;
}

.name-item-actions button:last-child:hover {
  background-color: #c82333;
}

.form-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding: 20px;
  margin-bottom: 24px;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  background-color: #f8f9fa;
}

.form-container input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-width: 200px;
}

.form-actions {
  display: flex;
  gap: 10px;
}

.form-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.form-actions button:first-child {
  background-color: #6c757d;
  color: white;
}

.form-actions button:first-child:hover {
  background-color: #5a6268;
}

.form-actions button:last-child {
  background-color: #007bff;
  color: white;
}

.form-actions button:last-child:hover:not(:disabled) {
  background-color: #0056b3;
}

.form-actions button:disabled {
  background-color: #6c757d;
  opacity: 0.6;
  cursor: not-allowed;
}

.no-results, .loading {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
  font-style: italic;
}
</style>
