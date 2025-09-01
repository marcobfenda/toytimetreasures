<template>
  <div class="contact-page">
    <div class="container py-5">
      <div class="row">
        <div class="col-12 col-md-8 mx-auto">
          <h1>Contact Us</h1>
          <p>Fill out the form below and we will get back to you soon.</p>
          <form @submit.prevent="submitForm" class="mt-4">
            <div class="mb-3">
              <label for="name" class="form-label">Name</label>
              <input v-model="form.name" type="text" class="form-control" id="name" required />
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email</label>
              <input v-model="form.email" type="email" class="form-control" id="email" required />
            </div>
            <div class="mb-3">
              <label for="message" class="form-label">Message</label>
              <textarea v-model="form.message" class="form-control" id="message" rows="5" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary">Send Message</button>
          </form>
          <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
          <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Contact',
  data() {
    return {
      form: {
        name: '',
        email: '',
        message: ''
      },
      successMessage: '',
      errorMessage: ''
    };
  },
  methods: {
    async submitForm() {
      this.successMessage = '';
      this.errorMessage = '';
      try {
        const apiBase = import.meta.env.VITE_API_BASE || '/api';
        const response = await axios.post(`${apiBase}/contact.php`, this.form);
        if (response.data.success) {
          this.successMessage = 'Your message has been sent!';
          this.form.name = '';
          this.form.email = '';
          this.form.message = '';
        } else {
          this.errorMessage = response.data.error || 'An error occurred.';
        }
      } catch (error) {
        this.errorMessage = 'An error occurred while sending your message.';
      }
    }
  }
}
</script>
