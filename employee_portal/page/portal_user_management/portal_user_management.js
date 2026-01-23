frappe.pages['portal-user-management'].on_page_load = function (wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Portal User Management',
		single_column: true
	});

	page.set_title('Portal User Management');
	page.set_indicator('Employee Portal', 'blue');

	// Add Refresh Button
	page.add_inner_button('Refresh', () => {
		load_users(page);
	});

	$(wrapper).bind('show', function () {
		load_users(page);
	});

	load_users(page);
}

function load_users(page) {
	page.main.empty();
	page.main.html('<div class="text-center text-muted" style="padding: 50px;">Loading users...</div>');

	frappe.call({
		method: 'employee_portal.api.get_portal_users',
		callback: function (r) {
			if (r.message) {
				render_table(page, r.message);
			} else {
				page.main.html('<div class="text-center text-muted" style="padding: 50px;">No users found with "Employee Self Service" role.</div>');
			}
		}
	});
}

function render_table(page, users) {
	let html = frappe.render_template('portal_user_management', { users: users });
	page.main.html(html);

	// Bind Change Events
	page.main.find('.portal-setting-check').on('change', function () {
		let user = $(this).data('user');
		let setting = $(this).data('setting'); // enable_attendance, etc.
		let checked = $(this).prop('checked') ? 1 : 0;

		// Get all current settings for this user from the DOM
		let row = $(this).closest('tr');
		let settings_payload = {
			enable_attendance: row.find('[data-setting="enable_attendance"]').prop('checked') ? 1 : 0,
			enable_expense_claim: row.find('[data-setting="enable_expense_claim"]').prop('checked') ? 1 : 0,
			enable_leave: row.find('[data-setting="enable_leave"]').prop('checked') ? 1 : 0
		};

		// Show saving indicator (optional, or just silent save)
		frappe.call({
			method: 'employee_portal.api.update_user_portal_settings',
			args: {
				user: user,
				settings: JSON.stringify(settings_payload)
			},
			callback: function (r) {
				if (r.message === 'Saved') {
					frappe.show_alert({ message: `Settings updated for ${user}`, indicator: 'green' });
					row.find('.status-indicator').removeClass('text-muted').addClass('text-success').text('Saved').show().fadeOut(2000);
				}
			}
		});
	});
}
