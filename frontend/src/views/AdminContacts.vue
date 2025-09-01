<template>
  <div class="admin-contacts container py-5">
    <h1>Contact Messages</h1>
    <div v-if="loading">Loading...</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <table v-if="messages.length" class="table table-striped mt-3">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Message</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="m in messages" :key="m.id">
          <td>{{ m.id }}</td>
          <td>{{ m.name }}</td>
          <td>{{ m.email }}</td>
          <td>{{ m.message }}</td>
          <td>{{ m.created_at }}</td>
        </tr>
      </tbody>
    </table>
    <div v-else class="mt-3">No messages found.</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AdminContacts',
  data() {
    return {
      messages: [],
      loading: false,
      error: ''
    }
  },
  async created() {
    this.loading = true;
    try {
      const res = await axios.get('/api/contact_messages.php');
      if (res.data.success) {
        this.messages = res.data.messages;
      } else {
        this.error = 'Failed to load messages.';
      }
    } catch (e) {
      this.error = 'Error fetching messages.';
    } finally {
      this.loading = false;
    }
  }
}
</script>
