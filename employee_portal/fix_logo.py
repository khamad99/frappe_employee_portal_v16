import frappe

def fix_company_logo():
    settings = frappe.get_doc("Employee Portal Settings", "Employee Portal Settings")
    print(f"Company Logo URL: {settings.company_logo}")
    
    if settings.company_logo:
        # Find the file record
        files = frappe.get_all("File", filters={"file_url": settings.company_logo}, fields=["name", "is_private", "file_url"])
        print(f"File Records Found: {files}")
        
        for file in files:
            if file.is_private:
                print(f"Making file {file.name} public...")
                doc = frappe.get_doc("File", file.name)
                doc.is_private = 0
                doc.save(ignore_permissions=True)
                frappe.db.commit()
                print("File is now public.")
            else:
                print(f"File {file.name} is already public.")
    else:
        print("No company logo set.")

if __name__ == "__main__":
    fix_company_logo()
