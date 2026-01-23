
import frappe
from frappe.utils import now_datetime, get_datetime_str, add_days
import pytz
from datetime import datetime, timedelta

def auto_checkout_employees():
    """
    Auto checkout employees who haven't checked out by 11:59 PM (Work Location Time).
    This job should run frequently (e.g., hourly) or once a day at the right time.
    Assuming it runs 'daily' or 'hourly'.
    
    If server time is different from Work Time, we need to handle this.
    User said: "all unchecked out user will be automaticly checked out at 11:59 pm UAE time"
    
    If this runs 'daily' at midnight server time:
    Server (Europe/Berlin) Midnight = 23:00 previous day or 00:00 (CET).
    UAE (Asia/Dubai) is +3h ahead.
    When it is 11:59 PM UAE, it is 8:59 PM Server (Winter).
    
    So we should check periodically if the time in UAE has passed 11:59 PM effectively for the current "Shift".
    
    Simplest logic for now:
    Run this daily. If we find any 'IN' logs from 'Yesterday' (relative to UAE time) that are still IN, close them.
    
    1. Get Global Settings (Work Timezone).
    2. Determine "Yesterday" in Work Timezone.
    3. Find Checkins for that day that have NO checkout.
    4. Insert Checkout at 11:59:59 PM of that day.
    """
    
    settings = frappe.get_doc("Employee Portal Settings", "Employee Portal Settings")
    if not settings.enable_attendance:
        return

    offset_hours = flt(settings.timezone_offset)
    
    # Server Time
    now_server = datetime.now()
    
    # Work Time = Server Time + Offset
    now_work = now_server + timedelta(hours=offset_hours)
    
    # We want to close shifts from "Yesterday" (Work Time).
    # If it is 12:05 AM (Work Time), Yesterday ended 5 mins ago.
    yesterday_work = now_work - timedelta(days=1)
    
    # Find latest Checkin for each employee.
    # Note: DB time is Server Time.
    
    latest_checkins = frappe.db.sql("""
        SELECT name, employee, time, log_type 
        FROM `tabEmployee Checkin` t1
        WHERE time = (SELECT MAX(time) FROM `tabEmployee Checkin` t2 WHERE t2.employee = t1.employee)
        AND log_type = 'IN' 
    """, as_dict=True)
    
    for log in latest_checkins:
        if not log.time: continue
        
        # Log Time (Server) -> Work Time
        log_time_server = log.time 
        if isinstance(log_time_server, str):
            log_time_server = datetime.strptime(log_time_server, "%Y-%m-%d %H:%M:%S")
            
        log_time_work = log_time_server + timedelta(hours=offset_hours)
        
        # If Log Date (Work Time) < Today (Work Time), it is from Yesterday or earlier.
        if log_time_work.date() < now_work.date():
             # Auto Checkout at 11:59:59 PM of that day (Work Time)
             checkout_work = log_time_work.replace(hour=23, minute=59, second=59)
             
             # Convert back to Server Time
             checkout_server = checkout_work - timedelta(hours=offset_hours)
             
             new_log = frappe.get_doc({
                "doctype": "Employee Checkin",
                "employee": log.employee,
                "log_type": "OUT",
                "time": checkout_server
            })
             new_log.insert(ignore_permissions=True)
             pass

