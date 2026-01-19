import frappe
from frappe.custom.doctype.custom_field.custom_field import create_custom_field

def create_portal_settings():
    if not frappe.db.exists("DocType", "Employee Portal Settings"):
        doc = frappe.get_doc({
            "doctype": "DocType",
            "module": "Employee Portal",
            "custom": 1,
            "name": "Employee Portal Settings",
            "is_submittable": 0,
            "issingle": 1,
            "fields": [
                {
                    "fieldname": "company_logo",
                    "fieldtype": "Attach Image",
                    "label": "Company Logo"
                },
                {
                    "fieldname": "login_title",
                    "fieldtype": "Data",
                    "label": "Login Title",
                    "default": "Employee Portal"
                },
                {
                    "fieldname": "login_message",
                    "fieldtype": "Small Text",
                    "label": "Login Message",
                    "default": "Welcome back! Please sign in to continue."
                },
                {
                    "fieldname": "feature_section",
                    "fieldtype": "Section Break",
                    "label": "Feature Toggles"
                },
                {
                    "fieldname": "enable_attendance",
                    "fieldtype": "Check",
                    "label": "Enable Attendance",
                    "default": 1
                },
                {
                    "fieldname": "enable_expense_claim",
                    "fieldtype": "Check",
                    "label": "Enable Expense Claim",
                    "default": 1
                },
                {
                    "fieldname": "enable_leave",
                    "fieldtype": "Check",
                    "label": "Enable Leave Application",
                    "default": 1
                }
            ],
            "permissions": [
                {
                    "role": "System Manager",
                    "read": 1,
                    "write": 1,
                    "create": 1
                },
                {
                    "role": "Employee",
                    "read": 1,
                    "write": 0,
                    "create": 0
                }
            ]
        })
        doc.insert()
        frappe.db.commit()
        print("Employee Portal Settings DocType created.")
    else:
        print("Employee Portal Settings DocType already exists.")

if __name__ == "__main__":
    create_portal_settings()
