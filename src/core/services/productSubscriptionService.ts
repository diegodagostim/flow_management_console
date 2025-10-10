import type { StorageAdapter } from '@/core/adapters/storage/StorageAdapter';
import type { 
  ProductSubscription, 
  CreateProductSubscriptionInput, 
  UpdateProductSubscriptionInput, 
  ProductSubscriptionFilters,
  ContractTemplate,
  CreateContractTemplateInput,
  UpdateContractTemplateInput,
  ContractTemplateFilters
} from '@/core/models/ClientManagement';
import { 
  ProductSubscriptionSchema, 
  ContractTemplateSchema 
} from '@/core/models/ClientManagement';
import type { Product, Module, Submodule } from '@/core/models/Product';
import { calculateModulePricing } from '@/core/models/Product';

/**
 * Product Subscription service for CRUD operations
 * Handles product subscriptions, contract generation, and billing integration
 */
export class ProductSubscriptionService {
  private readonly storage: StorageAdapter;
  private readonly subscriptionEntityKey = 'product_subscriptions';
  private readonly templateEntityKey = 'contract_templates';

  constructor(storage: StorageAdapter) {
    this.storage = storage;
  }

  /**
   * Get all product subscriptions
   */
  async getAll(filters?: ProductSubscriptionFilters): Promise<ProductSubscription[]> {
    try {
      const subscriptions = await this.storage.list<ProductSubscription>(this.subscriptionEntityKey);
      
      if (!filters) return subscriptions;

      return subscriptions.filter(subscription => {
        if (filters.clientId && subscription.clientId !== filters.clientId) return false;
        if (filters.productId && subscription.productId !== filters.productId) return false;
        if (filters.status && subscription.status !== filters.status) return false;
        if (filters.contractLength && subscription.contractLength.duration !== filters.contractLength) return false;
        return true;
      });
    } catch (error) {
      console.error('Failed to get product subscriptions:', error);
      throw new Error('Failed to fetch product subscriptions');
    }
  }

  /**
   * Get product subscription by ID
   */
  async getById(id: string): Promise<ProductSubscription | null> {
    try {
      if (!id) {
        throw new Error('Subscription ID is required');
      }
      
      const subscription = await this.storage.get<ProductSubscription>(`${this.subscriptionEntityKey}:${id}`);
      return subscription;
    } catch (error) {
      console.error('Failed to get product subscription by ID:', error);
      throw new Error('Failed to fetch product subscription');
    }
  }

  /**
   * Get subscriptions by client ID
   */
  async getByClientId(clientId: string): Promise<ProductSubscription[]> {
    try {
      const subscriptions = await this.getAll({ clientId });
      return subscriptions;
    } catch (error) {
      console.error('Failed to get subscriptions by client ID:', error);
      throw new Error('Failed to fetch client subscriptions');
    }
  }

  /**
   * Create a new product subscription
   */
  async create(input: CreateProductSubscriptionInput): Promise<ProductSubscription> {
    try {
      // Validate input
      const validatedInput = ProductSubscriptionSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(input);
      
      const subscription: ProductSubscription = {
        ...validatedInput,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await this.storage.set(`${this.subscriptionEntityKey}:${subscription.id}`, subscription);
      return subscription;
    } catch (error) {
      console.error('Failed to create product subscription:', error);
      console.error('Input data:', input);
      if (error instanceof Error && error.message.includes('validation')) {
        throw error;
      }
      throw new Error('Failed to create product subscription');
    }
  }

  /**
   * Update an existing product subscription
   */
  async update(id: string, input: UpdateProductSubscriptionInput): Promise<ProductSubscription> {
    try {
      const existingSubscription = await this.getById(id);
      if (!existingSubscription) {
        throw new Error('Product subscription not found');
      }

      const validatedInput = ProductSubscriptionSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial().parse(input);
      
      const updatedSubscription: ProductSubscription = {
        ...existingSubscription,
        ...validatedInput,
        updatedAt: new Date().toISOString(),
      };

      await this.storage.set(`${this.subscriptionEntityKey}:${id}`, updatedSubscription);
      return updatedSubscription;
    } catch (error) {
      console.error('Failed to update product subscription:', error);
      if (error instanceof Error && error.message.includes('validation')) {
        throw error;
      }
      throw new Error('Failed to update product subscription');
    }
  }

  /**
   * Delete a product subscription
   */
  async delete(id: string): Promise<void> {
    try {
      const subscription = await this.getById(id);
      if (!subscription) {
        throw new Error('Product subscription not found');
      }

      await this.storage.delete(`${this.subscriptionEntityKey}:${id}`);
    } catch (error) {
      console.error('Failed to delete product subscription:', error);
      throw new Error('Failed to delete product subscription');
    }
  }

  /**
   * Calculate subscription pricing based on selected modules and submodules
   */
  async calculatePricing(
    product: Product, 
    selectedModules: Array<{ moduleId: string; selectedSubmodules: string[] }>
  ): Promise<{ oneTimeCharges: number; recurringCharges: number; totalAmount: number; currency: string }> {
    try {
      let oneTimeCharges = 0;
      let recurringCharges = 0;
      let currency = 'USD';

      selectedModules.forEach(selection => {
        const module = product.modules.find(m => m.id === selection.moduleId);
        if (!module) return;

        // Calculate module pricing from selected submodules
        const selectedSubmodules = module.submodules.filter(sub => 
          selection.selectedSubmodules.includes(sub.id!)
        );

        selectedSubmodules.forEach(submodule => {
          currency = submodule.pricing.currency;
          if (submodule.pricing.type === 'one-time') {
            oneTimeCharges += submodule.pricing.amount;
          } else {
            recurringCharges += submodule.pricing.amount;
          }
        });
      });

      return {
        oneTimeCharges,
        recurringCharges,
        totalAmount: oneTimeCharges + recurringCharges,
        currency
      };
    } catch (error) {
      console.error('Failed to calculate pricing:', error);
      throw new Error('Failed to calculate subscription pricing');
    }
  }

  /**
   * Generate contract document
   */
  async generateContract(
    subscription: ProductSubscription,
    template?: ContractTemplate
  ): Promise<string> {
    try {
      // Use default template if none provided
      const contractTemplate = template || await this.getDefaultContractTemplate();
      
      // Replace template variables with subscription data
      let contractContent = contractTemplate.template;
      
      // Basic variables
      const variables = {
        'CLIENT_NAME': subscription.clientId, // You might want to fetch client name
        'PRODUCT_NAME': subscription.productName,
        'CONTRACT_START_DATE': subscription.contractLength.startDate,
        'CONTRACT_END_DATE': subscription.contractLength.endDate,
        'CONTRACT_DURATION': `${subscription.contractLength.duration} ${subscription.contractLength.unit}`,
        'TOTAL_AMOUNT': subscription.pricing.totalAmount.toString(),
        'CURRENCY': subscription.pricing.currency,
        'BILLING_CYCLE': subscription.pricing.billingCycle,
        'ONE_TIME_CHARGES': subscription.pricing.oneTimeCharges.toString(),
        'RECURRING_CHARGES': subscription.pricing.recurringCharges.toString(),
        'SELECTED_MODULES': subscription.selectedModules.map(m => m.moduleName).join(', '),
      };

      // Replace variables in template
      Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        contractContent = contractContent.replace(regex, value);
      });

      return contractContent;
    } catch (error) {
      console.error('Failed to generate contract:', error);
      throw new Error('Failed to generate contract document');
    }
  }

  /**
   * Get default contract template
   */
  async getDefaultContractTemplate(): Promise<ContractTemplate> {
    return {
      id: 'default',
      name: 'Default Product Subscription Contract',
      description: 'Standard contract template for product subscriptions',
      template: `
        <h1>Product Subscription Agreement</h1>
        
        <h2>Parties</h2>
        <p>This agreement is between {{CLIENT_NAME}} and our company.</p>
        
        <h2>Product Details</h2>
        <p>Product: {{PRODUCT_NAME}}</p>
        <p>Selected Modules: {{SELECTED_MODULES}}</p>
        
        <h2>Contract Terms</h2>
        <p>Contract Duration: {{CONTRACT_DURATION}}</p>
        <p>Start Date: {{CONTRACT_START_DATE}}</p>
        <p>End Date: {{CONTRACT_END_DATE}}</p>
        
        <h2>Pricing</h2>
        <p>Total Amount: {{TOTAL_AMOUNT}} {{CURRENCY}}</p>
        <p>One-time Charges: {{ONE_TIME_CHARGES}} {{CURRENCY}}</p>
        <p>Recurring Charges: {{RECURRING_CHARGES}} {{CURRENCY}}</p>
        <p>Billing Cycle: {{BILLING_CYCLE}}</p>
        
        <h2>Terms and Conditions</h2>
        <p>By signing this contract, both parties agree to the terms outlined above.</p>
      `,
      variables: [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // Contract Template Management

  /**
   * Get all contract templates
   */
  async getAllTemplates(filters?: ContractTemplateFilters): Promise<ContractTemplate[]> {
    try {
      const templates = await this.storage.list<ContractTemplate>(this.templateEntityKey);
      
      if (!filters) return templates;

      return templates.filter(template => {
        if (filters.name && !template.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
        if (filters.isActive !== undefined && template.isActive !== filters.isActive) return false;
        return true;
      });
    } catch (error) {
      console.error('Failed to get contract templates:', error);
      throw new Error('Failed to fetch contract templates');
    }
  }

  /**
   * Get contract template by ID
   */
  async getTemplateById(id: string): Promise<ContractTemplate | null> {
    try {
      if (!id) {
        throw new Error('Template ID is required');
      }
      
      const template = await this.storage.get<ContractTemplate>(`${this.templateEntityKey}:${id}`);
      return template;
    } catch (error) {
      console.error('Failed to get contract template by ID:', error);
      throw new Error('Failed to fetch contract template');
    }
  }

  /**
   * Create a new contract template
   */
  async createTemplate(input: CreateContractTemplateInput): Promise<ContractTemplate> {
    try {
      const validatedInput = ContractTemplateSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(input);
      
      const template: ContractTemplate = {
        ...validatedInput,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await this.storage.set(`${this.templateEntityKey}:${template.id}`, template);
      return template;
    } catch (error) {
      console.error('Failed to create contract template:', error);
      if (error instanceof Error && error.message.includes('validation')) {
        throw error;
      }
      throw new Error('Failed to create contract template');
    }
  }

  /**
   * Update an existing contract template
   */
  async updateTemplate(id: string, input: UpdateContractTemplateInput): Promise<ContractTemplate> {
    try {
      const existingTemplate = await this.getTemplateById(id);
      if (!existingTemplate) {
        throw new Error('Contract template not found');
      }

      const validatedInput = ContractTemplateSchema.omit({ id: true, createdAt: true, updatedAt: true }).partial().parse(input);
      
      const updatedTemplate: ContractTemplate = {
        ...existingTemplate,
        ...validatedInput,
        updatedAt: new Date().toISOString(),
      };

      await this.storage.set(`${this.templateEntityKey}:${id}`, updatedTemplate);
      return updatedTemplate;
    } catch (error) {
      console.error('Failed to update contract template:', error);
      if (error instanceof Error && error.message.includes('validation')) {
        throw error;
      }
      throw new Error('Failed to update contract template');
    }
  }

  /**
   * Delete a contract template
   */
  async deleteTemplate(id: string): Promise<void> {
    try {
      const template = await this.getTemplateById(id);
      if (!template) {
        throw new Error('Contract template not found');
      }

      await this.storage.delete(`${this.templateEntityKey}:${id}`);
    } catch (error) {
      console.error('Failed to delete contract template:', error);
      throw new Error('Failed to delete contract template');
    }
  }
}

