import { reactive } from 'vue'
import { createResource } from 'frappe-ui'

export const settings = reactive({
	data: null,
	loading: false,

	async fetch() {
		if (this.data) return this.data

		this.loading = true
		const call = createResource({
			url: 'employee_portal.api.get_portal_settings',
			method: 'GET'
		})

		try {
			// Custom API returns the data dict directly via call.fetch()
			const response = await call.fetch()
			this.data = response
		} catch (e) {
			console.error('Failed to fetch portal settings', e)
			// Fallback defaults
			this.data = {
				login_title: 'Employee Portal',
				login_message: 'Welcome back!',
				enable_attendance: 1,
				enable_expense_claim: 1,
				enable_leave: 1
			}
		} finally {
			this.loading = false
		}
		return this.data
	}
})
