import { reactive } from 'vue'
import { createResource } from 'frappe-ui'
import { useRouter } from 'vue-router'

export const session = reactive({
	user: null,
	employee: null,
	permissions: null,
	isLoggedIn: false,
	initialized: false,

	async login(email, password) {
		try {
			const call = createResource({
				url: 'login',
				method: 'POST',
				params: {
					usr: email,
					pwd: password,
				},
			})
			await call.fetch()
			this.user = await this.fetchUser()

			// Fetch employee details immediately after login
			try {
				this.employee = await this.fetchEmployee(this.user.email)
			} catch (e) {
				console.warn('Failed to fetch employee profile', e)
				this.employee = null
			}

			// Fetch permissions
			try {
				this.permissions = await this.fetchPermissions()
				if (!this.permissions?.has_portal_access) {
					await this.logout({ skipReload: true })
					throw new Error("Access Denied: You do not have 'Employee Self Service' permission.")
				}
			} catch (e) {
				console.warn('Failed to fetch permissions', e)
				if (e.message && e.message.includes('Access Denied')) throw e
			}

			this.isLoggedIn = true
			return this.user
		} catch (error) {
			throw error
		}
	},

	async logout(options = {}) {
		const call = createResource({
			url: 'logout',
		})
		await call.fetch()
		this.user = null
		this.employee = null
		this.permissions = null
		this.isLoggedIn = false
		if (!options?.skipReload) {
			window.location.reload()
		}
	},

	async fetchUser() {
		const call = createResource({
			url: 'frappe.auth.get_logged_user',
		})
		const data = await call.fetch()
		return data
	},

	async fetchPermissions() {
		const call = createResource({
			url: 'employee_portal.api.get_user_permissions',
			method: 'GET'
		})
		// Custom method returns dict directly via message or directly depending on frappe version, 
		// but createResource usually unwraps it. Let's assume direct return like settings.
		const data = await call.fetch()
		return data
	},

	async fetchEmployee(user_email) {
		const call = createResource({
			url: 'frappe.client.get_value',
			params: {
				doctype: 'Employee',
				fieldname: ['name', 'employee_name', 'image'],
				filters: { user_id: user_email }
			}
		})
		const data = await call.fetch()
		return data
	},

	async init() {
		try {
			// Wait for CSRF token to be available (fix for race condition on first load)
			if (!window.csrf_token) {
				let retries = 0;
				while (!window.csrf_token && retries < 20) {
					await new Promise(r => setTimeout(r, 50));
					retries++;
				}
				if (!window.csrf_token) {
					console.warn("CSRF token not found after waiting.");
				}
			}

			const user = await this.fetchUser()
			this.user = user
			try {
				const employee = await this.fetchEmployee(user.email)
				this.employee = employee
			} catch (e) {
				console.warn('Failed to fetch employee profile', e)
				this.employee = null
			}

			// Fetch permissions on init
			try {
				this.permissions = await this.fetchPermissions()
				if (this.permissions && !this.permissions.has_portal_access) {
					console.warn("User lacks portal permissions. Logging out.")
					await this.logout()
					return
				}
			} catch (e) {
				console.warn('Failed to fetch permissions', e)
				this.permissions = null
			}

			this.isLoggedIn = true
		} catch (error) {
			this.user = null
			this.employee = null
			this.isLoggedIn = false

			// Suppress error log for expected 403/401 when not logged in
			const isAuthError = error.message && (error.message.includes('PermissionError') || error.message.includes('403') || error.message.includes('401'));
			const isStatusError = error.status === 403 || error.status === 401 || error.statusCode === 403 || error.statusCode === 401;

			if (isAuthError || isStatusError) {
				console.log('User is currently guest/logged out.')
			} else {
				console.error('Session init failed', error)
			}
		} finally {
			this.initialized = true
		}
	},
})
