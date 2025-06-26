// Utility functions for the application

// Date formatting
function formatDate(dateString) {
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  return date.toLocaleDateString("es-CO", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}

// Currency formatting
function formatCurrency(amount) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Phone number formatting
function formatPhone(phone) {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, "")

  // Format as Colombian phone number
  if (cleaned.length === 10) {
    return `+57 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
  }

  return phone
}

// Validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone number
function isValidPhone(phone) {
  const phoneRegex = /^(\+57\s?)?[0-9]{10}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

// Generate random ID
function generateId() {
  return Date.now() + Math.random().toString(36).substr(2, 9)
}

// Debounce function
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle function
function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments
    
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Local storage helpers
const Storage = {
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error("Error saving to localStorage:", error)
    }
  },

  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error("Error reading from localStorage:", error)
      return defaultValue
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error("Error removing from localStorage:", error)
    }
  },

  clear() {
    try {
      localStorage.clear()
    } catch (error) {
      console.error("Error clearing localStorage:", error)
    }
  },
}

// Form validation helpers
const Validator = {
  required(value, fieldName) {
    if (!value || value.toString().trim() === "") {
      return `${fieldName} es requerido`
    }
    return null
  },

  email(value) {
    if (value && !isValidEmail(value)) {
      return "Email no válido"
    }
    return null
  },

  phone(value) {
    if (value && !isValidPhone(value)) {
      return "Teléfono no válido"
    }
    return null
  },

  number(value, fieldName) {
    if (value && isNaN(value)) {
      return `${fieldName} debe ser un número`
    }
    return null
  },

  min(value, min, fieldName) {
    if (value && Number.parseFloat(value) < min) {
      return `${fieldName} debe ser mayor a ${min}`
    }
    return null
  },

  max(value, max, fieldName) {
    if (value && Number.parseFloat(value) > max) {
      return `${fieldName} debe ser menor a ${max}`
    }
    return null
  },
}

// Form validation
function validateForm(formData, rules) {
  const errors = {}

  for (const field in rules) {
    const value = formData[field]
    const fieldRules = rules[field]

    for (const rule of fieldRules) {
      const error = rule(value)
      if (error) {
        errors[field] = error
        break
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

// Show form errors
function showFormErrors(errors) {
  // Clear previous errors
  document.querySelectorAll(".error-message").forEach((el) => el.remove())
  document.querySelectorAll(".error").forEach((el) => el.classList.remove("error"))

  // Show new errors
  for (const field in errors) {
    const input = document.querySelector(`[name="${field}"]`)
    if (input) {
      input.classList.add("error")

      const errorDiv = document.createElement("div")
      errorDiv.className = "error-message"
      errorDiv.textContent = errors[field]
      errorDiv.style.color = "#dc2626"
      errorDiv.style.fontSize = "0.75rem"
      errorDiv.style.marginTop = "0.25rem"

      input.parentNode.appendChild(errorDiv)
    }
  }
}

// Clear form errors
function clearFormErrors() {
  document.querySelectorAll(".error-message").forEach((el) => el.remove())
  document.querySelectorAll(".error").forEach((el) => el.classList.remove("error"))
}

// Export functions for use in other files
window.Utils = {
  formatDate,
  formatCurrency,
  formatPhone,
  isValidEmail,
  isValidPhone,
  generateId,
  debounce,
  throttle,
  Storage,
  Validator,
  validateForm,
  showFormErrors,
  clearFormErrors,
}
