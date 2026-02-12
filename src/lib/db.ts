// IndexedDB wrapper for offline storage
const DB_NAME = "FitProDB"
const DB_VERSION = 2

let db: IDBDatabase

export async function initDB() {
  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      db = request.result
      resolve()
    }

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result

      if (!database.objectStoreNames.contains("activities")) {
        const activityStore = database.createObjectStore("activities", { keyPath: "id", autoIncrement: true })
        activityStore.createIndex("date", "date", { unique: false })
      }

      if (!database.objectStoreNames.contains("diet")) {
        const dietStore = database.createObjectStore("diet", { keyPath: "id", autoIncrement: true })
        dietStore.createIndex("date", "date", { unique: false })
      }

      if (!database.objectStoreNames.contains("goals")) {
        const goalStore = database.createObjectStore("goals", { keyPath: "id", autoIncrement: true })
        goalStore.createIndex("createdAt", "createdAt", { unique: false })
      }

      if (!database.objectStoreNames.contains("water")) {
        const waterStore = database.createObjectStore("water", { keyPath: "id", autoIncrement: true })
        waterStore.createIndex("date", "date", { unique: false })
      }

      if (!database.objectStoreNames.contains("profile")) {
        database.createObjectStore("profile", { keyPath: "id" })
      }
    }
  })
}

export async function saveActivity(activity: any) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["activities"], "readwrite")
    const store = transaction.objectStore("activities")
    const request = store.add(activity)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

export async function getActivities(date?: string) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["activities"], "readonly")
    const store = transaction.objectStore("activities")
    const index = store.index("date")

    let request
    if (date) {
      request = index.getAll(date)
    } else {
      request = store.getAll()
    }

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result as any[])
  })
}

export async function saveDietEntry(entry: any) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["diet"], "readwrite")
    const store = transaction.objectStore("diet")
    const request = store.add(entry)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

export async function getDietEntries(date?: string) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["diet"], "readonly")
    const store = transaction.objectStore("diet")
    const index = store.index("date")

    let request
    if (date) {
      request = index.getAll(date)
    } else {
      request = store.getAll()
    }

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result as any[])
  })
}

export async function saveGoal(goal: any) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["goals"], "readwrite")
    const store = transaction.objectStore("goals")
    const request = store.add(goal)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

export async function getGoals() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["goals"], "readonly")
    const store = transaction.objectStore("goals")
    const request = store.getAll()

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result as any[])
  })
}

export async function updateGoal(id: number, goal: any) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["goals"], "readwrite")
    const store = transaction.objectStore("goals")
    const request = store.put({ ...goal, id })

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

export async function deleteGoal(id: number) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["goals"], "readwrite")
    const store = transaction.objectStore("goals")
    const request = store.delete(id)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

// Water Tracking
export async function saveWaterLog(amount: number) {
  const date = new Date().toISOString().split("T")[0]
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["water"], "readwrite")
    const store = transaction.objectStore("water")
    const request = store.add({ amount, date, timestamp: new Date().getTime() })

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

export async function getWaterLogs(date?: string) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["water"], "readonly")
    const store = transaction.objectStore("water")
    const index = store.index("date")

    let request
    if (date) {
      request = index.getAll(date)
    } else {
      request = store.getAll()
    }

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result as any[])
  })
}

// Profile Management
export async function saveProfile(profile: any) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["profile"], "readwrite")
    const store = transaction.objectStore("profile")
    const request = store.put({ ...profile, id: "user" })

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

export async function getProfile() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["profile"], "readonly")
    const store = transaction.objectStore("profile")
    const request = store.get("user")

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}
