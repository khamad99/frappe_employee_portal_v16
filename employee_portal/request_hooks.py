import frappe
from frappe import _

def check_portal_restriction():
	"""
	Intercept requests and redirect portal-only users away from backend.
	
	Allowed paths for portal-only users:
	- /portal/*
	- /login
	- /logout
	- /assets/*
	- /api/method/employee_portal.*  (Portal APIs)
	- /api/method/frappe.auth.*  (Auth APIs)
	- /api/method/logout
	- /files/*  (File access)
	- /private/files/* (Private file access - permissions handled by core)
	- /third_party_apps/*
	"""
	if frappe.session.user in ("Guest", "Administrator"):
		return

	# Check if user has restriction enabled
	# We rely on specific user settings document
	if not frappe.db.exists("Employee Portal User Settings", frappe.session.user):
		return

	user_settings = frappe.get_doc("Employee Portal User Settings", frappe.session.user)
	if not user_settings.restrict_to_portal:
		return

	request_path = frappe.request.path
	
	# Whitelisted prefixes
	allowed_prefixes = (
		"/portal",
		"/login",
		"/logout",
		"/assets",
		"/files",
		"/private/files",
		"/api/method/employee_portal",
		"/api/method/frappe.auth", # essential for login/pwd change
        "/api/method/frappe.auth.get_logged_user", # explicitly allow
		"/api/method/login", # Standard login
		"/api/method/frappe.client.get_value", # often used by client scripts
		"/api/method/frappe.client.get", # often used by client scripts
		"/api/method/frappe.client.get_list", # often used by client scripts
		"/api/method/frappe.client.insert", # Used by portal
		"/api/method/frappe.desk.form.save.savedocs", # Used by portal
        "/api/method/frappe.utils.print_format.download_pdf", # Used by portal
		"/api/method/logout",
		"/api/method/upload_file", # For file attachments
		"/socket.io", # Realtime updates
	)

	if request_path == "/" or request_path.startswith(allowed_prefixes):
		return

	# If we are here, the path is restricted
	
	# Handle AJAX/API requests differently (return JSON error/action)
	# is_xhr is deprecated/removed in newer Werkzeug
	is_ajax = (frappe.request.headers.get("X-Requested-With") == "XMLHttpRequest") or frappe.request.content_type == "application/json"
	
	if is_ajax or request_path.startswith("/api/"):
		# Setting type to binary/json prevents HTML rendering
		# Actually, standard failure is 403
		frappe.throw(_("Access Restricted: You are limited to the User Portal."), frappe.PermissionError)

	# Redirect to portal for standard Browser navigation
	from werkzeug.exceptions import HTTPException
	from werkzeug.wrappers import Response

	class PortalRedirect(HTTPException):
		code = 302
		def get_response(self, environ=None):
			return Response(status=302, headers={"Location": "/portal/"})

	raise PortalRedirect()
