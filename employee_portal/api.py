import frappe
from frappe.utils import flt, getdate, today
from erpnext.accounts.utils import get_balance_on
from erpnext.accounts.report.general_ledger.general_ledger import get_gl_entries

@frappe.whitelist(allow_guest=True)
def get_portal_settings():
    # Fetch with ignore_permissions since standard users won't have read access to the settings DocType
    doc = frappe.get_doc("Employee Portal Settings", "Employee Portal Settings")
    return {
        "company_logo": doc.company_logo,
        "login_title": doc.login_title,
        "login_message": doc.login_message,
        "enable_attendance": doc.enable_attendance,
        "enable_attendance": doc.enable_attendance,
        "enable_attendance_card": doc.enable_attendance_card,
        "timezone_offset": doc.timezone_offset,
        "enable_expense_claim": doc.enable_expense_claim,
        "enable_leave": doc.enable_leave
    }

@frappe.whitelist()
def get_user_permissions():
    """Returns permission flags for the current user, considering overrides"""
    roles = frappe.get_roles()
    if "Employee Self Service" not in roles:
        return {
            "can_expense": False,
            "can_leave": False,
            "can_attendance": False,
            "can_attendance_card": False,
            "has_portal_access": False
        }

    # Global Defaults (ignore permissions)
    global_settings = frappe.get_doc("Employee Portal Settings", "Employee Portal Settings")
    
    # User Overrides
    user_settings = None
    if frappe.db.exists("Employee Portal User Settings", frappe.session.user):
        user_settings = frappe.get_doc("Employee Portal User Settings", frappe.session.user)
    
    # Resolve Effective Settings (User > Global)
    enable_attendance = user_settings.enable_attendance if user_settings else global_settings.enable_attendance
    enable_attendance = user_settings.enable_attendance if user_settings else global_settings.enable_attendance
    enable_attendance_card = user_settings.enable_attendance_card if user_settings else global_settings.enable_attendance_card
    enable_expense_claim = user_settings.enable_expense_claim if user_settings else global_settings.enable_expense_claim
    enable_leave = user_settings.enable_leave if user_settings else global_settings.enable_leave
    enable_petty_cash = user_settings.enable_petty_cash if user_settings else global_settings.enable_petty_cash
    
    # Petty cash also requires an account to be set if enabled at user level
    petty_cash_account = user_settings.petty_cash_account if user_settings else None
    
    # If enabled globally but not set for user, disable it (safety check)
    if enable_petty_cash and not petty_cash_account:
        enable_petty_cash = 0

    return {
        "can_expense": bool(enable_expense_claim) and frappe.has_permission("Expense Claim", "read"),
        "can_leave": bool(enable_leave) and frappe.has_permission("Leave Application", "read"),
        "can_leave": bool(enable_leave) and frappe.has_permission("Leave Application", "read"),
        "can_attendance": bool(enable_attendance) and frappe.has_permission("Attendance", "read"),
        "can_attendance_card": bool(enable_attendance_card),
        "can_petty_cash": bool(enable_petty_cash),
        "has_portal_access": True
    }

@frappe.whitelist()
def get_portal_users():
    """
    Get all users with 'Employee Self Service' role and their settings.
    Restricted to System Manager / HR Manager.
    """
    if not (frappe.has_permission("User", "write") or "HR Manager" in frappe.get_roles()):
         frappe.throw("Not permitted", frappe.PermissionError)

    # Fetch users with the role
    users = frappe.db.sql("""
        SELECT 
            u.name as user, u.full_name, u.email, e.name as employee
        FROM 
            `tabUser` u
        LEFT JOIN
            `tabEmployee` e ON e.user_id = u.name
        WHERE 
            u.enabled = 1 AND u.name in (
                SELECT parent FROM `tabHas Role` WHERE role = 'Employee Self Service'
            )
        ORDER BY u.full_name ASC
    """, as_dict=True)

    # Fetch all user settings to map efficiently
    all_settings = frappe.get_all("Employee Portal User Settings", 
                                 fields=["user", "enable_attendance", "enable_attendance_card", "enable_expense_claim", "enable_leave", "enable_petty_cash", "petty_cash_account"])
    settings_map = {s.user: s for s in all_settings}
    
    # Fetch global defaults for reference
    global_defaults = frappe.get_single("Employee Portal Settings")

    for user in users:
        settings = settings_map.get(user.user)
        if settings:
            user.update({
                "enable_attendance": settings.enable_attendance,
                "enable_attendance_card": settings.enable_attendance_card,
                "enable_expense_claim": settings.enable_expense_claim,
                "enable_leave": settings.enable_leave,
                "enable_petty_cash": settings.enable_petty_cash,
                "petty_cash_account": settings.petty_cash_account,
                "is_overridden": True
            })
        else:
            user.update({
                "enable_attendance": global_defaults.enable_attendance,
                "enable_attendance_card": global_defaults.enable_attendance_card,
                "enable_expense_claim": global_defaults.enable_expense_claim,
                "enable_leave": global_defaults.enable_leave,
                "enable_petty_cash": global_defaults.enable_petty_cash,
                "petty_cash_account": None,
                "is_overridden": False
            })
            
    return users

@frappe.whitelist()
def update_user_portal_settings(user, settings):
    """
    Update settings for a user.
    settings: JSON string of dict {enable_attendance, ...}
    """
    if not (frappe.has_permission("User", "write") or "HR Manager" in frappe.get_roles()):
         frappe.throw("Not permitted", frappe.PermissionError)
    
    settings_dict = frappe.parse_json(settings)
    
    if not frappe.db.exists("Employee Portal User Settings", user):
        doc = frappe.get_doc({
            "doctype": "Employee Portal User Settings",
            "user": user
        })
        doc.update(settings_dict)
        doc.insert()
    else:
        doc = frappe.get_doc("Employee Portal User Settings", user)
        doc.update(settings_dict)
        doc.save()
    
    return "Saved"

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

@frappe.whitelist()
def get_expense_claim_history(name):
    """
    Fetch document history/activity for an Expense Claim.
    Uses Comment doctype to track workflow transitions and user comments.
    """
    if not frappe.db.exists("Expense Claim", name):
        frappe.throw("Expense Claim not found", frappe.DoesNotExistError)
    
    doc = frappe.get_doc("Expense Claim", name)
    
    # Security: Only owner or users with HR/System Manager role can view
    if doc.owner != frappe.session.user:
        roles = frappe.get_roles()
        if not any(r in roles for r in ["HR Manager", "HR User", "System Manager", "Expense Approver"]):
            frappe.throw("You don't have permission to view this document's history", frappe.PermissionError)
    
    # Fetch comments (workflow transitions, user comments, etc.)
    comments = frappe.get_all(
        "Comment",
        filters={
            "reference_doctype": "Expense Claim",
            "reference_name": name,
            "comment_type": ["in", ["Workflow", "Created", "Submitted", "Cancelled", "Comment", "Info"]]
        },
        fields=["name", "comment_type", "content", "owner", "creation", "comment_by"],
        order_by="creation asc"
    )
    
    # Enrich with user details
    history = []
    for c in comments:
        user_name = c.comment_by or frappe.db.get_value("User", c.owner, "full_name") or c.owner
        
        # Parse content for workflow transitions
        action_text = c.content or ""
        if c.comment_type == "Workflow":
            # Workflow comments are stored as plain text like "Status changed to Need Review"
            action_text = c.content
        elif c.comment_type == "Created":
            action_text = "Created this expense claim"
        elif c.comment_type == "Submitted":
            action_text = "Submitted for approval"
        elif c.comment_type == "Cancelled":
            action_text = "Cancelled"
        
        history.append({
            "type": c.comment_type,
            "content": action_text,
            "user": user_name,
            "user_email": c.owner,
            "timestamp": c.creation
        })
    
    # Add document creation as first entry if no "Created" comment exists
    if not any(h["type"] == "Created" for h in history):
        owner_name = frappe.db.get_value("User", doc.owner, "full_name") or doc.owner
        history.insert(0, {
            "type": "Created",
            "content": "Created this expense claim",
            "user": owner_name,
            "user_email": doc.owner,
            "timestamp": doc.creation
        })
    
    return history

@frappe.whitelist()
def get_expense_attachments(name):
    """
    Fetch file attachments for an Expense Claim.
    Returns list of attached files with file_name, file_url, and is_private.
    """
    if not frappe.db.exists("Expense Claim", name):
        frappe.throw("Expense Claim not found", frappe.DoesNotExistError)
    
    doc = frappe.get_doc("Expense Claim", name)
    
    # Security: Only owner or users with HR/System Manager role can view
    if doc.owner != frappe.session.user:
        roles = frappe.get_roles()
        if not any(r in roles for r in ["HR Manager", "HR User", "System Manager", "Expense Approver"]):
            frappe.throw("You don't have permission to view this document's attachments", frappe.PermissionError)
    
    attachments = frappe.get_all(
        "File",
        filters={
            "attached_to_doctype": "Expense Claim",
            "attached_to_name": name
        },
        fields=["name", "file_name", "file_url", "is_private"],
        order_by="creation asc"
    )
    
    return attachments

@frappe.whitelist()
def delete_expense_attachment(file_name):
    """
    Delete an attachment from an Expense Claim.
    Only allowed when the claim's workflow_state is Pending or Draft.
    """
    if not frappe.db.exists("File", file_name):
        frappe.throw("File not found", frappe.DoesNotExistError)
    
    file_doc = frappe.get_doc("File", file_name)
    
    # Verify file is attached to an Expense Claim
    if file_doc.attached_to_doctype != "Expense Claim":
        frappe.throw("This file is not attached to an Expense Claim", frappe.PermissionError)
    
    expense_name = file_doc.attached_to_name
    if not frappe.db.exists("Expense Claim", expense_name):
        frappe.throw("Expense Claim not found", frappe.DoesNotExistError)
    
    expense_doc = frappe.get_doc("Expense Claim", expense_name)
    
    # Security: Only owner can delete attachments
    if expense_doc.owner != frappe.session.user:
        roles = frappe.get_roles()
        if not any(r in roles for r in ["HR Manager", "System Manager"]):
            frappe.throw("You can only delete attachments from your own claims", frappe.PermissionError)
    
    # Status check: Only allow deletion when Pending or Draft
    allowed_states = ["Pending", "Draft", "", None]
    if expense_doc.workflow_state not in allowed_states:
        frappe.throw(f"Cannot delete attachments when claim is in '{expense_doc.workflow_state}' state. Only allowed when Pending.")
    
    if expense_doc.docstatus != 0:
        frappe.throw("Cannot delete attachments from submitted or cancelled claims")
    
    # Delete the file
    frappe.delete_doc("File", file_name, ignore_permissions=True)
    return "Deleted"

# Force reload
@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def get_users_with_portal_role(doctype, txt, searchfield, start, page_len, filters):
    """
    Custom query to fetch users with 'Employee Self Service' role.
    """
    role = "Employee Self Service"
    
    # Base SQL
    sql = f"""
        SELECT 
            name, full_name 
        FROM 
            `tabUser` 
        WHERE 
            enabled=1 
            AND name IN (SELECT parent FROM `tabHas Role` WHERE role=%(role)s)
            AND (name LIKE %(txt)s OR full_name LIKE %(txt)s)
        ORDER BY 
            case when name like %(txt)s then 0 else 1 end, 
            case when full_name like %(txt)s then 0 else 1 end, 
            name asc
        LIMIT %(start)s, %(page_len)s
    """
    
    
    return frappe.db.sql(sql, {
        "role": role,
        "txt": f"%{txt}%",
        "start": start,
        "page_len": page_len
    })

@frappe.whitelist()
def get_petty_cash_balance():
    """Returns the current balance of the employee's petty cash account."""
    if not frappe.db.exists("Employee Portal User Settings", frappe.session.user):
        return {"balance": 0.0, "currency": None, "account": None}
    
    settings = frappe.get_doc("Employee Portal User Settings", frappe.session.user)
    if not settings.enable_petty_cash or not settings.petty_cash_account:
        return {"balance": 0.0, "currency": None, "account": None}
    
    account = settings.petty_cash_account
    balance = get_balance_on(account=account)
    currency = frappe.db.get_value("Account", account, "account_currency") or frappe.defaults.get_global_defaults().default_currency
    
    return {
        "balance": balance,
        "currency": currency,
        "account": account
    }

@frappe.whitelist()
def get_petty_cash_ledger(from_date=None, to_date=None, cost_center=None, project=None):
    """Returns ledger entries for the employee's petty cash account."""
    if not frappe.db.exists("Employee Portal User Settings", frappe.session.user):
        frappe.throw("Petty cash not configured")
        
    settings = frappe.get_doc("Employee Portal User Settings", frappe.session.user)
    if not settings.enable_petty_cash or not settings.petty_cash_account:
        frappe.throw("Petty cash not enabled")
        
    account = settings.petty_cash_account
    company = frappe.defaults.get_user_default("Company")
    
    filters = frappe._dict({
        "company": company,
        "account": account,
        "from_date": from_date or "2000-01-01",
        "to_date": to_date or today(),
        "group_by": "Group by Voucher (Consolidated)", 
        "include_dimensions": 1,
        "show_remarks": True
    })
    
    # Parse JSON if passed as string (from frontend query params)
    if isinstance(cost_center, str) and cost_center.startswith("["):
        try:
            cost_center = frappe.parse_json(cost_center)
        except Exception:
            pass
            
    if isinstance(project, str) and project.startswith("["):
        try:
            project = frappe.parse_json(project)
        except Exception:
            pass

    if cost_center:
        if isinstance(cost_center, list):
            filters.cost_center = cost_center
        else:
            filters.cost_center = cost_center
            
    if project:
        if isinstance(project, list):
            filters.project = project
        else:
            filters.project = project
        
    # Manually fetch GL Entries to ensure strict filtering
    gl_filters = {
        "account": account,
        "posting_date": ["between", [filters.from_date, filters.to_date]],
        "is_cancelled": 0,
        "company": company
    }
    
    if filters.get("cost_center"):
        gl_filters["cost_center"] = ["in", filters.cost_center] if isinstance(filters.cost_center, list) else filters.cost_center
        
    if filters.get("project"):
        gl_filters["project"] = ["in", filters.project] if isinstance(filters.project, list) else filters.project
        
    entries = frappe.db.get_list("GL Entry",
        filters=gl_filters,
        fields=["posting_date", "voucher_type", "voucher_no", "remarks", "debit", "credit", "cost_center", "project"],
        order_by="posting_date asc, creation asc"
    )
    
    # Format for frontend
    data = []
    
    # Calculate Opening Balance
    opening_balance = 0
    if from_date:
        opening_balance = get_balance_on(account=account, date=frappe.utils.add_days(from_date, -1))
        
    running_balance = opening_balance
    
    # Add opening line
    if from_date:
        data.append({
            "posting_date": from_date, # Show Start Date as Opening Date
            "voucher_type": "Opening",
            "voucher_no": "",
            "remarks": "Opening Balance",
            "debit": 0,
            "credit": 0,
            "balance": opening_balance
        })

    for entry in entries:
        running_balance += entry.debit - entry.credit
        data.append({
            "posting_date": entry.posting_date,
            "voucher_type": entry.voucher_type,
            "voucher_no": entry.voucher_no,
            "remarks": entry.remarks,
            "debit": entry.debit,
            "credit": entry.credit,
            "balance": running_balance,
            "cost_center": entry.cost_center,
            "project": entry.project
        })
        
    return data

@frappe.whitelist()
def get_cost_centers():
    """Fetch Cost Centers for dropdown (ignore permissions safe for dropdown)"""
    return frappe.get_all("Cost Center", 
        filters={
            "is_group": 0,
            "company": frappe.defaults.get_user_default("Company")
        },

        fields=["name", "cost_center_name as label", "name as value"],
        order_by="name asc",
        ignore_permissions=True
    )

@frappe.whitelist()
def get_projects():
    """Fetch Projects for dropdown (ignore permissions safe for dropdown)"""
    return frappe.get_all("Project", 
        filters={
            "status": "Open",
            # "company": frappe.defaults.get_user_default("Company") # Projects might be cross-company, but usually filtered
        },

        fields=["name", "project_name as label", "name as value"],
        order_by="name asc",
        ignore_permissions=True
    )

@frappe.whitelist()
def get_employee_assets():
    """Returns list of assets where current user is the custodian."""
    user = frappe.session.user
    employee = frappe.db.get_value("Employee", {"user_id": user}, "name")

    if not employee:
        return {"assets": [], "total_count": 0}

    assets = frappe.get_all(
        "Asset",
        filters={
            "custodian": employee,
            "docstatus": 1,  # Submitted assets only
            "status": ["not in", ["Scrapped", "Sold", "Draft", "Cancelled"]]
        },
        fields=[
            "name", "asset_name", "asset_category",
            "location", "status", "image", "purchase_date", "item_code", "item_name"
        ],
        order_by="asset_category, asset_name"
    )

    return {"assets": assets, "total_count": len(assets)}
