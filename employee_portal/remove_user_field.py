import frappe

def remove_user_restriction_field():
    if frappe.db.exists("Custom Field", {"dt": "User", "fieldname": "restrict_to_portal"}):
        frappe.delete_doc("Custom Field", {"dt": "User", "fieldname": "restrict_to_portal"})
        frappe.db.commit()
        print("Custom field 'restrict_to_portal' removed from User DocType.")
    else:
        print("Custom field 'restrict_to_portal' not found.")

if __name__ == "__main__":
    remove_user_restriction_field()
