<template>
  <MainLayout>
    <div class="space-y-6">
        <div v-if="!session.employee" class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div class="flex">
                <div class="ml-3">
                    <p class="text-sm text-yellow-700">
                        No Employee record found linked to your account. Please contact HR to link your User ID to an Employee profile.
                    </p>
                </div>
            </div>
        </div>
        <div v-else class="space-y-6">
            <h1 class="text-2xl font-semibold text-gray-900">Dashboard</h1>
        
        <!-- Components will go here -->
         <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <!-- Attendance Card -->
             <div class="bg-white overflow-hidden shadow rounded-lg p-5" v-if="session.permissions?.can_attendance_card">
                 <h3 class="text-lg font-medium text-gray-900">Today's Attendance</h3>
                 <div class="mt-4">
                     <!-- Slider Component -->
                     <CheckinSlider 
                        :label="sliderLabel" 
                        :center-text="centerText"
                        :status="checkinStatus"
                        :loading="loadingCheckin"
                        :disabled="isRestricted"
                        @confirmed="handleCheckin" 
                     />
                 </div>
             </div>

              <!-- Financial Summary Card -->
             <div class="bg-white overflow-hidden shadow rounded-lg p-5">
                 <FinancialSummary />
             </div>
         </div>

         <!-- Assets Section -->
         <AssetSummary />

         <!-- Calendar Section -->
         <div class="bg-white overflow-hidden shadow rounded-lg p-5">
              <h3 class="text-lg font-medium text-gray-900 mb-4">Leave & Attendance</h3>
              <AttendanceCalendar />
         </div>
         </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '@/components/MainLayout.vue'
import CheckinSlider from '@/components/CheckinSlider.vue'
import AttendanceCalendar from '@/components/AttendanceCalendar.vue'
import FinancialSummary from '@/components/FinancialSummary.vue'
import AssetSummary from '@/components/AssetSummary.vue'
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { session } from '@/data/session'
import { createResource } from 'frappe-ui'

const lastCheckin = ref(null)
const todayCheckins = ref([])
const loadingCheckin = ref(true)
const currentTime = ref(new Date())
const settings = ref({ timezone_offset: 0 })
let timer = null

// Fetch timezone settings
const fetchSettings = async () => {
    try {
        const call = createResource({ url: 'employee_portal.api.get_portal_settings' })
        const data = await call.fetch()
        if (data.timezone_offset !== undefined) settings.value.timezone_offset = parseFloat(data.timezone_offset) || 0
    } catch (e) { console.error('Failed to fetch settings', e) }
}

// Format Time helper (Server Time + Offset)
const formatTime = (date) => {
    if (!date) return ''
    // date is either Date object (currentTime) or string (YYYY-MM-DD HH:mm:ss) from Server.
    // If string, Browser converts it to Local. 
    // Wait, User wants "Server Time + Offset".
    // If running in UAE, browser local time is correct (Server UTC+1 + 3 = UTC+4).
    // If I use "Server Time" string from Frappe, it is "10:00" (if server says so).
    // User wants to shift this by offset.
    
    // Simplest: We assume `date` is treated as UTC if new Date(date) parses it?
    // No, Chrome parses "2024-01-22 10:00:00" as LOCAL time.
    // We want to force it to be treated as base time, then add offset hours.
    
    let d = new Date(date)
    
    // If passing currentTime (which is browser time), and we want to show "Server + Offset".
    // This implies we ignore browser timezone entirely.
    // BUT we don't know Server Time on frontend easily without fetching it.
    // Except we assume "Server is Germany" (UTC+1).
    // The offset is "server location and current location... deference".
    // "values will be 24 to -24". 
    // This implies: Display Time = Server/System Time + Offset.
    
    // For `lastCheckin.time` (String from DB):
    // "2024-01-22 10:00:00". 
    // We want to add Offset hours to this.
    // Parse manually to avoid timezone shifts.
    
    let timeMs = d.getTime()
    if (typeof date === 'string') {
        // Parse "YYYY-MM-DD HH:mm:ss" as UTC to get stable base? 
        // Or just manipulate hours.
        // Let's use simple logic:
        // Treat as UTC to avoid DST mess for now (or native Date).
        // Actually, if we just want to add hours visually:
        d = new Date(date.replace(' ', 'T') + 'Z') // Treat as UTC
        // Since it's stored as naive in DB.
    } else {
        // currentTime (Date object).
        // We want to show "Current Server Time + Offset".
        // Use UTC as base?
        // Server time is usually UTC or Local.
        // Let's assume Server=UTC (Frappe standard).
        // Then Offset is from UTC.
        // User said: "server is on Germany ... add 3 hours".
        // Germany is +1. UAE is +4. Diff is 3. 
        // So User wants: Work Time = Server Time + 3. 
        // So offset is applied to Server Time.
        
        // Convert to UTC, then add Server Timezone? 
        // No, `currentTime` on client is accurate absolute time (UTC).
        // We need: UTC timestamp.
        // Then add (ServerOffset + UserOffset)?
        // User provided ONE field: "deference".
        // So Display Time = Server Time + Difference.
        
        // This relies on knowing Server Time.
        // Let's assume Server Time is roughly UTC (standard cloud) or based on settings.
        // If Server is Germany (UTC+1), and we add 3, we get UTC+4.
        
        // So: Display = UTC + (ServerTZOffset + UserOffset).
        // We don't know ServerTZOffset.
        // BUT `lastCheckin.time` is already recorded in Server Local Time.
        // So `lastCheckin.time` + Offset is correct Work Time.
        
        if (typeof date !== 'string') {
            // currentTime case. Use Client UTC?
            // Need to approximate Server Time. 
            // Better: Use `frappe.datetime.now_datetime()` from backend? Too expensive.
            // Client Time (UTC) + 1 (Germany) + 3 (Offset) = UTC+4.
            // We can guess Server is UTC+0 or UTC+1.
            // Let's assume user configured offset assuming Server is base.
            // Display = Client(UTC) + (Offset + X).
            // This is getting complicated.
            // Let's stick to: "Time shown in middle is fixed time where user slide".
            // If they slide NOW, we record NOW (Client Time? No, Server Time).
            // Then we display Record + Offset.
        }
    }
    
    // Display Logic for stored times:
    // Parse string as UTC. Add offset hours. Value is `d`.
    // Format `d` as UTC HH:mm.
    
    // For `currentTime`: 
    // We need to show "Live Time". 
    // "UAE Time" (UTC+4).
    // If settings.timezone_offset = 3 (Server Germany UTC+1 -> UAE UTC+4).
    // Then Server Time = UTC+1.
    // Display = UTC+1 + 3 = UTC+4.
    // So Display = UTC + 4.
    // Logic: Display = currentUTC + (ServerBase + Offset).
    // If we assume Server is UTC, then Display = UTC + Offset.
    // If Server is Germany (UTC+1), Display = UTC + 1 + Offset.
    // User sets offset=3. Result UTC+4.
    // So we need to add (1 + Offset) to UTC.
    // How do we know "1"? We don't.
    // BUT we can assume User sets offset to match desired result purely.
    // If they see it's wrong, they adjust offset.
    // So simply: Display = UTC + (User Configured Total Offset from UTC).
    // Wait, user said "amount of deference only" between Server and Work.
    
    // Okay, for `lastCheckin.time`:
    // It is Server Time. 
    // Display = Server Time + Offset.
    // Simple.
    
    // For `currentTime` (Live):
    // We need "Current Server Time".
    // We can simulate it: UTC + 1 (Hardcoded assumption? Or just rely on browser).
    // If I use `new Date().toLocaleTimeString('en-US', { timeZone: 'Europe/Berlin' })` as base...
    // No, that puts dependencies back.
    
    // Use `lastCheckin` logic ONLY for display.
    // For live clock... "show the fixed time where the user slide exactly".
    // "when sliding... time to show in the middle is the fixed time".
    // Meaning we don't show live clock?
    // "time to show... is the fixed time WHERE the user slide EXACTLY".
    // This implies capturing the timestamp at slide moment.
    // Wait, centerText in 'IN' state usually shows Current Time.
    // If user says "fixed time", maybe they mean "Time they Checked In"?
    // "show the fixed time where the user slide exactly in HH:MM format".
    // If I checked in at 9:00, it stays 9:00.
    // Yes! `centerText` is ALREADY implementing "Checked In at <Time>".
    // So I don't need a live clock.
    // I just need to format the Stored Time + Offset.
    
    // Correct.
    
    // Code:
    if (typeof date !== 'string') return '' // We only format stored strings.
    
    // Parse "YYYY-MM-DD HH:mm:ss" assuming it is "Server Time"
    // Treat as simple struct.
    const [ymd, hms] = date.split(' ')
    const [y, m, day] = ymd.split('-').map(Number)
    const [H, M, S] = hms.split(':').map(Number)
    
    // Add offset
    let dObj = new Date(Date.UTC(y, m-1, day, H, M, S))
    dObj.setUTCHours(dObj.getUTCHours() + settings.value.timezone_offset)
    
    return dObj.toLocaleTimeString('en-US', { 
        timeZone: 'UTC', // Ensure we print the shifted time exactly
        hour: '2-digit', minute: '2-digit' 
    })
}

const checkinStatus = computed(() => {
    if (loadingCheckin.value) return 'OUT'
    return (lastCheckin.value && lastCheckin.value.log_type === 'IN') ? 'IN' : 'OUT'
})

const sliderLabel = computed(() => {
    if (loadingCheckin.value) return 'Loading...'
    return 'Slide to Check In' 
})

const centerText = computed(() => {
    if (loadingCheckin.value) return 'Loading...'
    
    if (checkinStatus.value === 'IN') {
        return `Checked In at ${formatTime(lastCheckin.value.time)}`
    } else {
        if (lastCheckin.value && lastCheckin.value.log_type === 'OUT') {
            // Duration
            const outTimestamp = new Date(lastCheckin.value.time.replace(' ', 'T')).getTime() // Treat as local for diff
            // Need matching IN.
            const matchingIn = todayCheckins.value.find(c => c.log_type === 'IN' && new Date(c.time.replace(' ', 'T')).getTime() < outTimestamp)
            
            let durationStr = ''
            if (matchingIn) {
                // Diff is timezone agnostic (both are Server Time)
                const inTimestamp = new Date(matchingIn.time.replace(' ', 'T')).getTime()
                const diffMs = outTimestamp - inTimestamp
                const hours = Math.floor(diffMs / (1000 * 60 * 60))
                const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
                durationStr = ` - Duration: ${hours}h ${minutes}m`
            }
            return `Checked Out at ${formatTime(lastCheckin.value.time)}${durationStr}`
        }
        return 'Slide to Check In'
    }
})

const isRestricted = computed(() => {
    if (loadingCheckin.value) return true
    if (checkinStatus.value === 'IN') return false
    // If OUT, allowed only if 0 checkins today?
    // "allowed only once per day".
    // 2 logs (IN, OUT) = Done.
    // 1 log (IN) = In Progress (status is IN).
    // 0 logs = Allowed.
    if (todayCheckins.value.filter(l => l.log_type === 'IN').length >= 1 && checkinStatus.value === 'OUT') return true
    // If I have IN log today, and I am OUT, I finished.
    return false
})

const fetchLastCheckin = async () => {
    if (!session.employee) return
    loadingCheckin.value = true
    const call = createResource({
        url: 'frappe.client.get_list',
        params: {
            doctype: 'Employee Checkin',
            filters: { 
                employee: session.employee.name,
                time: ['>=', new Date().toISOString().split('T')[0] + ' 00:00:00']
            },
            order_by: 'time desc',
            limit: 10,
            fields: ['log_type', 'time', 'name', 'creation']
        }
    })
    try {
        const data = await call.fetch()
        todayCheckins.value = data || []
        
        if (data && data.length > 0) {
            lastCheckin.value = data[0]
        } else {
            lastCheckin.value = null
        }
    } catch (e) {
        console.error(e)
    } finally {
        loadingCheckin.value = false
    }
}

const handleCheckin = async (direction) => {
    if (!session.employee) return
    
    // Direction: 'IN' (Slide Right) or 'OUT' (Slide Left)
    const logType = direction
    
    // Safety
    if (logType === 'IN' && checkinStatus.value === 'IN') return
    if (logType === 'OUT' && checkinStatus.value === 'OUT') return
    if (isRestricted.value && logType === 'IN') {
        alert("You are allowed only one check-in per day.")
        return
    }

    const call = createResource({
        url: 'frappe.client.insert',
        params: {
            doc: {
                doctype: 'Employee Checkin',
                employee: session.employee.name,
                log_type: logType,
                time: new Date().toISOString().replace('T', ' ').split('.')[0]
            }
        }
    })
    
    try {
        await call.fetch()
        await fetchLastCheckin()
    } catch (e) {
        console.error(e)
        alert('Check-in action failed')
    }
}

onMounted(async () => {
   // Removed Timer, fixed display
   if (session.initialized && session.employee) {
       await fetchSettings()
       fetchLastCheckin()
   } else {
       setTimeout(async () => {
           if(session.employee) {
               await fetchSettings()
               fetchLastCheckin()
           }
       }, 1000)
   }
})
</script>
