import frappe

@frappe.whitelist(allow_guest=True)
def get_portal_settings():
    doc = frappe.get_single("Employee Portal Settings")
    return {
        "company_logo": doc.company_logo,
        "login_title": doc.login_title,
        "login_message": doc.login_message,
        "enable_attendance": doc.enable_attendance,
        "enable_expense_claim": doc.enable_expense_claim,
        "enable_leave": doc.enable_leave
    }

@frappe.whitelist()
def get_user_permissions():
    """Returns permission flags for the current user"""
    roles = frappe.get_roles()
    return {
        "can_expense": frappe.has_permission("Expense Claim", "read"),
        "can_leave": frappe.has_permission("Leave Application", "read"),
        "can_attendance": frappe.has_permission("Attendance", "read"),
        "has_portal_access": "Employee Self Service" in roles
    }

@frappe.whitelist()
def delete_expense_claim(name):
    """Allows standard users to delete their own Draft claims."""
    if not frappe.db.exists("Expense Claim", name):
        raise frappe.DoesNotExistError

    doc = frappe.get_doc("Expense Claim", name)
    
    # Security Checks
    if doc.owner != frappe.session.user:
        frappe.throw("You can only delete your own claims", frappe.PermissionError)
        
    if doc.docstatus != 0:
        frappe.throw("You can only delete Draft claims")

    if doc.workflow_state in ["Need Review", "Approved", "Submitted"]:
        frappe.throw("Cannot delete claim that is under review or approved")

    # If checks pass, delete with ignore_permissions
    frappe.delete_doc("Expense Claim", name, ignore_permissions=True)
    return "Deleted"

# Force reload
