// API utility functions
class API {
  static async request(url, options = {}) {
    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    const config = { ...defaultOptions, ...options }

    try {
      const response = await fetch(url, config)
      const data = await response.json()
      return data
    } catch (error) {
      console.error("API Error:", error)
      throw error
    }
  }

  static async get(url) {
    return this.request(url, { method: "GET" })
  }

  static async post(url, data) {
    return this.request(url, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  static async postFormData(url, formData) {
    return fetch(url, {
      method: "POST",
      body: formData,
    }).then((response) => response.json())
  }

  static async put(url, data) {
    return this.request(url, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  static async delete(url, data = {}) {
    return this.request(url, {
      method: "DELETE",
      body: JSON.stringify(data),
    })
  }
}

// Specific API endpoints
class ClientsAPI {
  static async getAll() {
    return API.get("api/clients.php")
  }

  static async create(formData) {
    return API.postFormData("api/clients.php", formData)
  }

  static async update(id, data) {
    return API.put("api/clients.php", { id, ...data })
  }

  static async delete(id) {
    return API.delete("api/clients.php", { id })
  }
}

class PaymentsAPI {
  static async getAll() {
    return API.get("api/payments.php")
  }

  static async create(formData) {
    return API.postFormData("api/payments.php", formData)
  }

  static async update(id, data) {
    return API.put("api/payments.php", { id, ...data })
  }

  static async delete(id) {
    return API.delete("api/payments.php", { id })
  }
}

class InvoicesAPI {
  static async getAll() {
    return API.get("api/invoices.php")
  }

  static async create(formData) {
    return API.postFormData("api/invoices.php", formData)
  }

  static async update(id, data) {
    return API.put("api/invoices.php", { id, ...data })
  }

  static async delete(id) {
    return API.delete("api/invoices.php", { id })
  }
}

class AntennasAPI {
  static async getAll() {
    return API.get("api/antennas.php")
  }

  static async create(formData) {
    return API.postFormData("api/antennas.php", formData)
  }

  static async update(id, data) {
    return API.put("api/antennas.php", { id, ...data })
  }

  static async delete(id) {
    return API.delete("api/antennas.php", { id })
  }
}

class InstallationsAPI {
  static async getAll() {
    return API.get("api/installations.php")
  }

  static async create(formData) {
    return API.postFormData("api/installations.php", formData)
  }

  static async update(id, data) {
    return API.put("api/installations.php", { id, ...data })
  }

  static async delete(id) {
    return API.delete("api/installations.php", { id })
  }
}
