<template>
  <div class="admin-categories container py-5">
    <h1>Categories</h1>
    <div v-if="loading">Loading...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="row">
      <div class="col-lg-7">
        <div class="mb-2 d-flex flex-column align-items-start">
          <h5 class="m-0">Category List</h5>
          <small class="text-muted">Drag to reorder — changes are saved automatically</small>
        </div>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody ref="list">
            <tr v-for="c in categories" :key="c.id" :draggable="true" @dragstart="onDragStart($event, c.id)" @dragover="onDragOver($event, c.id)" @drop="onDrop($event, c.id)" @dragend="onDragEnd" :class="{ 'table-active': dragOverId == c.id }" style="cursor: move;">
              <td>{{ c.id }}</td>
              <td>{{ c.name }}</td>
              <td>{{ c.is_active ? 'Yes' : 'No' }}</td>
              <td>
                <button class="btn btn-sm btn-outline-primary me-2" @click="editCategory(c)">Edit</button>
                <button class="btn btn-sm btn-outline-danger" @click="deleteCategory(c.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-lg-5">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Add / Edit Category</h5>
            <form @submit.prevent="saveCategory">
              <input v-model="form.id" type="hidden" />
              <div class="mb-3">
                <label class="form-label">Name</label>
                <input v-model="form.name" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Slug</label>
                <input v-model="form.slug" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Description</label>
                <textarea v-model="form.description" class="form-control"></textarea>
              </div>
              <div class="mb-3 form-check">
                <input v-model="form.is_active" type="checkbox" class="form-check-input" id="is_active" />
                <label class="form-check-label" for="is_active">Active</label>
              </div>
              <button class="btn btn-primary" type="submit">Save</button>
              <button class="btn btn-secondary ms-2" type="button" @click="resetForm">Reset</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useToastStore } from '@/stores/toast'

export default {
  name: 'AdminCategories',
    data() {
      return {
      categories: [],
      loading: false,
      error: '',
      draggingId: null,
      dragOverId: null,
      orderChanged: false,
      form: {
        id: null,
        name: '',
        slug: '',
        description: '',
        is_active: true
      }
    }
  },
  async created() {
    await this.fetchCategories();
  },
  methods: {
  onDragStart(evt, id) {
      this.draggingId = id;
      // add some data for Firefox
      try { evt.dataTransfer.setData('text/plain', String(id)); } catch (e) {}
    },
  async onDrop(evt, targetId) {
      const dragId = this.draggingId || evt.dataTransfer.getData('text/plain');
      if (!dragId) return;
      const dragIdNum = Number(dragId);
      if (dragIdNum === Number(targetId)) return;

      const list = [...this.categories];
      const fromIndex = list.findIndex(x => Number(x.id) === dragIdNum);
      const toIndex = list.findIndex(x => Number(x.id) === Number(targetId));
      if (fromIndex === -1 || toIndex === -1) return;

      // remove dragged item
      const [moved] = list.splice(fromIndex, 1);
      // insert before target
      list.splice(toIndex, 0, moved);

      this.categories = list;
        this.orderChanged = true;
        this.draggingId = null;
        this.dragOverId = null;

        // Autosave immediately after drop
        await this.saveOrder();
    },
    onDragEnd() {
      this.draggingId = null;
      this.dragOverId = null;
    },
    onDragOver(evt, id) {
      // highlight the row being hovered as a drop target
      this.dragOverId = id;
      evt.preventDefault();
    },
  async fetchCategories() {
      this.loading = true;
      this.error = '';
      try {
    // Request admin list (include inactive)
    const res = await axios.get('/api/categories.php?admin=1');
    // API returns array directly
    this.categories = res.data.map(c => ({ ...c, is_active: !!c.is_active }));
      } catch (e) {
        this.error = 'Failed to load categories.';
      } finally {
        this.loading = false;
      }
    },
    resetForm() {
      this.form = { id: null, name: '', slug: '', description: '', is_active: true };
    },
    editCategory(c) {
      // Ensure boolean for checkbox
      this.form = { ...c, is_active: !!c.is_active };
    },
    async saveCategory() {
      try {
        const toast = useToastStore()
        if (this.form.id) {
          // PUT
          const payload = { ...this.form, is_active: this.form.is_active ? 1 : 0 };
          const res = await axios.put(`/api/categories.php?id=${this.form.id}`, payload);
          if (res.data && res.data.success) toast.show('Category updated', 'success');
          else toast.show('Failed to update category', 'danger');
        } else {
          // POST
          const payload = { ...this.form, is_active: this.form.is_active ? 1 : 0 };
          const res = await axios.post('/api/categories.php', payload);
          if (res.data && res.data.success) toast.show('Category created', 'success');
          else toast.show('Failed to create category', 'danger');
        }
        await this.fetchCategories();
        this.resetForm();
      } catch (e) {
        this.error = 'Failed to save category.';
        useToastStore().show('Failed to save category', 'danger');
      }
    },
    async deleteCategory(id) {
      if (!confirm('Delete this category?')) return;
      try {
  const res = await axios.delete(`/api/categories.php?id=${id}`);
  // backend returns { success: true }
  const toast = useToastStore();
  if (res.data && res.data.success) toast.show('Category deleted', 'success');
  else toast.show('Failed to delete category', 'danger');
  await this.fetchCategories();
      } catch (e) {
  this.error = 'Failed to delete category.';
  useToastStore().show('Failed to delete category', 'danger');
      }
    }
    ,
    async saveOrder() {
      if (!this.orderChanged) return;
      try {
        const ids = this.categories.map(c => Number(c.id));
        const res = await axios.post('/api/categories.php', { action: 'reorder', order: ids });
        if (res.data && res.data.success) {
          this.orderChanged = false;
          useToastStore().show('Order saved', 'success');
          await this.fetchCategories();
        } else {
          useToastStore().show('Failed to save order', 'danger');
        }
      } catch (e) {
      useToastStore().show('Failed to save order', 'danger');
      }
    },
    
  }
}
</script>

<style scoped>
.custom-toast-wrapper {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1080;
  width: auto;
  max-width: 90%;
}
.custom-toast {
  display: flex;
  align-items: center;
  gap: .5rem;
  background: #fff;
  color: #000;
  border: 1px solid rgba(0,0,0,0.08);
  padding: .5rem .75rem;
  border-radius: .5rem;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
}
.custom-toast-danger {
  border-color: rgba(220,53,69,0.9);
}
.toast-icon { width: 20px; height: 20px; display:flex; align-items:center; justify-content:center; }
.toast-text { font-weight: 500; }
.toast-slide-enter-active, .toast-slide-leave-active { transition: all 250ms ease; }
.toast-slide-enter-from { opacity: 0; transform: translateY(-10px) scale(0.98); }
.toast-slide-enter-to { opacity: 1; transform: translateY(0) scale(1); }
.toast-slide-leave-from { opacity: 1; transform: translateY(0) scale(1); }
.toast-slide-leave-to { opacity: 0; transform: translateY(-6px) scale(0.98); }
</style>
