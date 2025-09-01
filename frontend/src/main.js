import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useProductStore } from '@/stores/product'

// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Import Font Awesome
import '@fortawesome/fontawesome-free/css/all.min.css'

// Import custom CSS
import './assets/css/style.css'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)

// Preload product data so homepage has categories and featured products on first render
const preload = async () => {
	try {
		const productStore = useProductStore()
		await Promise.all([
			productStore.fetchCategories(),
			productStore.fetchFeaturedProducts()
		])
		console.log('Preloaded product data')
	} catch (e) {
		console.error('Error preloading product data', e)
	}
}

preload().finally(() => {
	app.mount('#app')
	console.log('Vue app mounted')
})
