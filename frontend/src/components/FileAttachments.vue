<template>
  <div class="mt-6 border-t border-gray-200 pt-6" v-if="docname">
    <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4 flex items-center">
      <Paperclip class="w-5 h-5 mr-2 text-gray-400" />
      Attachments
      <span v-if="attachments.length" class="ml-2 text-sm text-gray-500">({{ attachments.length }})</span>
    </h3>

    <!-- Attachment List -->
    <div class="space-y-2 mb-4" v-if="attachments.length">
      <div 
        v-for="file in attachments" 
        :key="file.name" 
        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
      >
        <div class="flex items-center min-w-0">
          <FileText class="w-4 h-4 text-gray-400 mr-3 flex-shrink-0" />
          <a 
            :href="file.file_url" 
            target="_blank" 
            class="text-sm text-indigo-600 hover:text-indigo-800 truncate"
            :title="file.file_name"
          >
            {{ file.file_name }}
          </a>
        </div>
        <button 
          v-if="!readonly"
          @click="deleteFile(file.name)"
          :disabled="deleting === file.name"
          class="ml-3 text-red-400 hover:text-red-600 focus:outline-none disabled:opacity-50 transition"
          title="Remove attachment"
        >
          <Loader2 v-if="deleting === file.name" class="w-4 h-4 animate-spin" />
          <Trash2 v-else class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div v-else class="text-sm text-gray-500 mb-4">
      No attachments yet.
    </div>

    <!-- Upload Section -->
    <div v-if="!readonly" class="relative">
      <input 
        type="file" 
        ref="fileInput" 
        @change="handleUpload" 
        class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        :disabled="uploading"
        accept=".pdf, image/png, image/jpeg, image/jpg"
        multiple
      />
      <div 
        class="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 transition cursor-pointer"
        :class="{ 'opacity-50 cursor-not-allowed': uploading }"
      >
        <Loader2 v-if="uploading" class="w-4 h-4 mr-2 animate-spin text-indigo-500" />
        <Upload v-else class="w-4 h-4 mr-2 text-gray-400" />
        <span class="text-sm text-gray-600">
          {{ uploading ? 'Uploading...' : 'Click or drag files to upload' }}
        </span>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="mt-3 p-3 bg-red-50 text-red-700 text-sm rounded-md">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { createResource } from 'frappe-ui'
import { Paperclip, FileText, Trash2, Upload, Loader2 } from 'lucide-vue-next'

const props = defineProps({
  doctype: {
    type: String,
    required: true
  },
  docname: {
    type: String,
    default: ''
  },
  readonly: {
    type: Boolean,
    default: false
  }
})

const attachments = ref([])
const uploading = ref(false)
const deleting = ref(null)
const error = ref('')
const fileInput = ref(null)

const fetchAttachments = async () => {
  if (!props.docname) return
  
  try {
    const call = createResource({
      url: 'employee_portal.api.get_expense_attachments',
      params: { name: props.docname }
    })
    attachments.value = await call.fetch()
    error.value = ''
  } catch (e) {
    console.error('Failed to fetch attachments', e)
    // Don't show error for new docs
    if (props.docname) {
      error.value = 'Failed to load attachments'
    }
  }
}

const handleUpload = async (e) => {
  const files = e.target.files
  if (!files || files.length === 0) return
  
  uploading.value = true
  error.value = ''
  
  try {
    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('doctype', props.doctype)
      formData.append('docname', props.docname)
      formData.append('is_private', 1)
      
      const response = await fetch('/api/method/frappe.handler.upload_file', {
        method: 'POST',
        body: formData,
        headers: {
          'X-Frappe-CSRF-Token': window.csrf_token
        }
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Upload failed')
      }
    }
    
    // Refresh attachment list
    await fetchAttachments()
    
  } catch (e) {
    console.error('Upload failed', e)
    error.value = e.message || 'Failed to upload file'
  } finally {
    uploading.value = false
    // Reset file input
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

const deleteFile = async (fileName) => {
  if (!confirm('Are you sure you want to remove this attachment?')) return
  
  deleting.value = fileName
  error.value = ''
  
  try {
    const call = createResource({
      url: 'employee_portal.api.delete_expense_attachment',
      params: { file_name: fileName }
    })
    await call.fetch()
    
    // Refresh attachment list
    await fetchAttachments()
    
  } catch (e) {
    console.error('Delete failed', e)
    error.value = e.message || 'Failed to delete attachment'
  } finally {
    deleting.value = null
  }
}

// Watch for docname changes
watch(() => props.docname, (newVal) => {
  if (newVal) {
    fetchAttachments()
  } else {
    attachments.value = []
  }
})

onMounted(() => {
  if (props.docname) {
    fetchAttachments()
  }
})
</script>
