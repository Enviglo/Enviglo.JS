interface StoreInfo {
  id: string
  name: string
  ownerId: string
  activated: boolean
  appearance: {
    banner?: string
    description: string
    icon?: string
  }
  guildId: string
  placeId: bigint
  flags: string
  preferredLocale: string
  vanityURLCode?: string
  createdAt: Date
  updatedAt: Date
  version: number
}

class Store {
  private info: StoreInfo | null = null

  constructor(private id: string, private apiKey: string) {}

  async fetchInfoFromAPI(): Promise<void> {
    try {
      // Example API call
      const response = await fetch(
        `https://enviglo.com/api/v1/store/${this.id}`,
        { headers: { Authorization: `Bearer ${this.apiKey}` } }
      )
      if (!response.ok) {
        throw new Error('Failed to fetch store information')
      }
      const data = await response.json()
      if (!data.status) {
        throw new Error('Failed to fetch store information')
      }
      data.data.id = data.data._id.toString()
      data.data._id = null
      this.info = data.data
    } catch (error) {
      console.error('Error fetching store information:', error)
      throw error
    }
  }

  async getInfo(): Promise<StoreInfo> {
    if (!this.info) {
      await this.fetchInfoFromAPI()
    }
    if (!this.info) {
      throw new Error('Store information not available')
    }
    return this.info
  }

  // Example method, you can add more methods here
  async updateInfo(newInfo: Partial<StoreInfo>): Promise<StoreInfo | null> {
    try {
      const response = await fetch(
        `https://enviglo.com/api/v1/store/${this.id}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newInfo),
        }
      )
      if (!response.ok) {
        throw new Error('Failed to update store information')
      }
      const updatedInfo = await response.json()
      if (!updatedInfo.status) {
        throw new Error('Failed to update store information')
      }
      this.info = updatedInfo.data
      return this.info
    } catch (error) {
      console.error('Error updating store information:', error)
      throw error
    }
  }
}

export default Store
