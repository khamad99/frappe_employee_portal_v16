// Copyright (c) 2026, kalshaer and contributors
// For license information, please see license.txt

frappe.ui.form.on("Employee Portal User Settings", {
	refresh(frm) {
		frm.set_query("user", function () {
			return {
				query: "employee_portal.api.get_users_with_portal_role"
			};
		});

		frm.set_query("petty_cash_account", function () {
			return {
				filters: {
					account_type: "Cash",
					is_group: 0,
					company: frappe.defaults.get_user_default("Company")
				}
			};
		});
	},
});
