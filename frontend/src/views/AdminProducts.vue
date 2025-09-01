<template>
  <div class="admin-products container py-5">
    <h1>Products</h1>
    <div v-if="loading">Loading...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="row">
      <div class="col-lg-7">
        <div class="mb-2 d-flex flex-column align-items-start">
          <h5 class="m-0">Product List</h5>
          <small class="text-muted">Add, edit or delete products</small>
        </div>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Thumb</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in products" :key="p.id">
              <td>{{ p.id }}</td>
              <td>
                <img :src="thumbnailSrc(p)" alt="thumb" style="width:60px;height:60px;object-fit:cover;border-radius:6px;" />
              </td>
              <td>{{ p.name }}</td>
              <td>{{ p.price }}</td>
              <td>{{ p.category_name }}</td>
              <td>
                <button class="btn btn-sm btn-outline-primary me-2" @click="editProduct(p)">Edit</button>
                <button class="btn btn-sm btn-outline-danger" @click="deleteProduct(p.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col-lg-5">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Add / Edit Product</h5>
            <form @submit.prevent="saveProduct">
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
                <label class="form-label">Short description</label>
                <input v-model="form.short_description" class="form-control" />
              </div>
              <div class="mb-3">
                <label class="form-label">Price</label>
                <input v-model.number="form.price" class="form-control" type="number" step="0.01" />
              </div>
              <div class="mb-3">
                <label class="form-label">Stock Quantity</label>
                <input v-model.number="form.stock_quantity" class="form-control" type="number" min="0" />
                <small class="form-text text-muted">Enter 0 for out of stock</small>
              </div>
              <div class="mb-3">
                <label class="form-label">Category</label>
                <select v-model="form.category_id" class="form-select">
                  <option :value="null">-- None --</option>
                  <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Product Image</label>
                <input type="file" class="form-control" @change="onFileChange" accept="image/*" />
                <div v-if="previewUrl" class="mt-2">
                  <img :src="previewUrl" alt="preview" style="max-width:100%; max-height:160px; object-fit:contain;" />
                </div>
                <button v-if="selectedFile" class="btn btn-sm btn-outline-secondary mt-2" type="button" @click="uploadImage">Upload Image</button>
              </div>
              <div class="form-check mb-3">
                <input v-model="form.is_active" type="checkbox" class="form-check-input" id="prod_active" />
                <label class="form-check-label" for="prod_active">Active</label>
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
  name: 'AdminProducts',
  data() {
    return {
      products: [],
      categories: [],
      loading: false,
      error: '',
      selectedFile: null,
      previewUrl: null,
      form: {
        id: null,
        name: '',
        slug: '',
        short_description: '',
        price: null,
        stock_quantity: 0,
        category_id: null,
        is_active: true
      }
    }
  },
  async created() {
    await Promise.all([this.fetchProducts(), this.fetchCategories()]);
  },
  methods: {
    async fetchProducts() {
      this.loading = true;
      try {
        const res = await axios.get('/api/products.php?admin=1');
        this.products = res.data;
      } catch (e) {
        this.error = 'Failed to load products.';
      } finally {
        this.loading = false;
      }
    },
    async fetchCategories() {
      try {
        const res = await axios.get('/api/categories.php?admin=1');
        this.categories = res.data;
      } catch (e) {
        // ignore
      }
    },
    // Return a thumbnail URL. If the image path begins with /images we prefix it with /api
    thumbnailSrc(p) {
      // Inline SVG placeholder to avoid extra network requests from the dev server
      const placeholderSvg = encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="12" fill="#9ca3af">No image</text></svg>');
      const placeholder = `data:image/svg+xml;utf8,${placeholderSvg}`;

      if (!p || !p.primary_image) return placeholder;
      // If it's already an absolute URL (http(s)) use it directly
      if (p.primary_image.startsWith('http://') || p.primary_image.startsWith('https://')) return p.primary_image;
      // If it starts with /images, construct an absolute URL to the backend (nginx) so the browser hits port 80
      if (p.primary_image.startsWith('/images')) {
        return window.location.protocol + '//' + window.location.hostname + p.primary_image;
      }
      // otherwise, return as-is
      return p.primary_image || placeholder;
    },
    onFileChange(e) {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      // validate type and size (3MB)
      if (!['image/jpeg','image/png','image/webp'].includes(f.type)) {
        useToastStore().show('Invalid image type. Use JPG/PNG/WebP.', 'danger');
        return;
      }
      if (f.size > 3 * 1024 * 1024) {
        useToastStore().show('Image too large (max 3MB).', 'danger');
        return;
      }
      this.selectedFile = f;
      this.previewUrl = URL.createObjectURL(f);
    },
    async uploadImage() {
      if (!this.selectedFile) return;
      if (!this.form.id) {
        useToastStore().show('Save product before uploading an image.', 'info');
        return;
      }
      const fd = new FormData();
      fd.append('product_id', this.form.id);
      fd.append('image', this.selectedFile);
      try {
        const res = await axios.post('/api/product_images.php', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        if (res.data && res.data.success) {
          useToastStore().show('Image uploaded', 'success');
          // refresh products to show new image if UI supports it
          await this.fetchProducts();
          this.selectedFile = null;
          this.previewUrl = null;
        } else {
          useToastStore().show(res.data.message || 'Upload failed', 'danger');
        }
      } catch (e) {
        useToastStore().show('Upload failed', 'danger');
      }
    },
    resetForm() {
      this.form = { id: null, name: '', slug: '', short_description: '', price: null, stock_quantity: 0, category_id: null, is_active: true };
    },
    editProduct(p) {
      this.form = { 
        ...p, 
        is_active: !!p.is_active, 
        category_id: p.category_id ? Number(p.category_id) : null,
        stock_quantity: p.stock_quantity || 0
      };
    },
    async saveProduct() {
      try {
        const payload = { ...this.form, is_active: this.form.is_active ? 1 : 0 };
        if (this.form.id) {
          const res = await axios.put(`/api/products.php?id=${this.form.id}`, payload);
          if (res.data && res.data.success) {
            useToastStore().show('Product updated', 'success');
            await this.fetchProducts();
            this.resetForm();
          }
        } else {
          const res = await axios.post('/api/products.php', payload);
          if (res.data && res.data.success) {
            useToastStore().show('Product created', 'success');
            // set the returned id so the image uploader can attach images
            this.form.id = res.data.id
            // refresh list so admin sees the new product, but keep the form populated for further actions (upload)
            await this.fetchProducts();
          }
        }
      } catch (e) {
        this.error = 'Failed to save product.';
      }
    },
    async deleteProduct(id) {
      if (!confirm('Delete this product?')) return;
      try {
        const res = await axios.delete(`/api/products.php?id=${id}`);
        if (res.data && res.data.success) useToastStore().show('Product deleted', 'success');
        await this.fetchProducts();
      } catch (e) {
        this.error = 'Failed to delete product.';
      }
    }
  }
}
</script>
