import type { StorageAdapter } from '@/core/adapters/storage/StorageAdapter'
import type { Client, CreateClientInput, UpdateClientInput, ClientFilters } from '@/core/models/Client'
import { ClientSchema } from '@/core/models/Client'

/**
 * Client service for CRUD operations
 * Implements business logic for client management
 */
export class ClientService {
  private readonly storage: StorageAdapter;
  private readonly entityKey = 'clients';

  constructor(storage: StorageAdapter) {
    this.storage = storage;
  }

  /**
   * Get all clients
   */
  async getAll(): Promise<Client[]> {
    try {
      const clients = await this.storage.list<Client>(this.entityKey);
      return clients.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      });
    } catch (error) {
      console.error('Failed to get all clients:', error);
      throw new Error('Failed to fetch clients');
    }
  }

  /**
   * Get client by ID
   */
  async getById(id: string): Promise<Client | null> {
    try {
      if (!id) {
        throw new Error('Client ID is required');
      }
      
      const client = await this.storage.get<Client>(`${this.entityKey}:${id}`);
      return client;
    } catch (error) {
      console.error('Failed to get client by ID:', error);
      throw new Error('Failed to fetch client');
    }
  }

  /**
   * Create a new client
   */
  async create(input: CreateClientInput): Promise<Client> {
    try {
      // Validate input
      const validatedInput = ClientSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(input);
      
      const client: Client = {
        ...validatedInput,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await this.storage.set(`${this.entityKey}:${client.id}`, client);
      return client;
    } catch (error) {
      console.error('Failed to create client:', error);
      if (error instanceof Error && error.message.includes('validation')) {
        throw error;
      }
      throw new Error('Failed to create client');
    }
  }

  /**
   * Update an existing client
   */
  async update(id: string, input: UpdateClientInput): Promise<Client> {
    try {
      if (!id) {
        throw new Error('Client ID is required');
      }

      const existingClient = await this.getById(id);
      if (!existingClient) {
        throw new Error('Client not found');
      }

      // Validate input
      const validatedInput = ClientSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial().parse(input);
      
      const updatedClient: Client = {
        ...existingClient,
        ...validatedInput,
        updatedAt: new Date().toISOString(),
      };

      await this.storage.set(`${this.entityKey}:${id}`, updatedClient);
      return updatedClient;
    } catch (error) {
      console.error('Failed to update client:', error);
      if (error instanceof Error && error.message.includes('validation')) {
        throw error;
      }
      throw new Error('Failed to update client');
    }
  }

  /**
   * Delete a client
   */
  async delete(id: string): Promise<void> {
    try {
      if (!id) {
        throw new Error('Client ID is required');
      }

      const existingClient = await this.getById(id);
      if (!existingClient) {
        throw new Error('Client not found');
      }

      await this.storage.delete(`${this.entityKey}:${id}`);
    } catch (error) {
      console.error('Failed to delete client:', error);
      throw new Error('Failed to delete client');
    }
  }

  /**
   * Search clients with filters
   */
  async search(filters: ClientFilters): Promise<Client[]> {
    try {
      const allClients = await this.getAll();
      
      return allClients.filter(client => {
        // Search filter
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          const matchesSearch = 
            client.name.toLowerCase().includes(searchLower) ||
            client.email?.toLowerCase().includes(searchLower) ||
            client.company?.toLowerCase().includes(searchLower) ||
            client.phone?.includes(filters.search);
          
          if (!matchesSearch) return false;
        }

        // Company filter
        if (filters.company) {
          if (client.company !== filters.company) return false;
        }

        // Date filters
        if (filters.createdAfter) {
          const createdAfter = new Date(filters.createdAfter);
          const clientCreated = new Date(client.createdAt || 0);
          if (clientCreated < createdAfter) return false;
        }

        if (filters.createdBefore) {
          const createdBefore = new Date(filters.createdBefore);
          const clientCreated = new Date(client.createdAt || 0);
          if (clientCreated > createdBefore) return false;
        }

        return true;
      });
    } catch (error) {
      console.error('Failed to search clients:', error);
      throw new Error('Failed to search clients');
    }
  }

  /**
   * Get clients count
   */
  async getCount(): Promise<number> {
    try {
      const clients = await this.getAll();
      return clients.length;
    } catch (error) {
      console.error('Failed to get clients count:', error);
      throw new Error('Failed to get clients count');
    }
  }
}
