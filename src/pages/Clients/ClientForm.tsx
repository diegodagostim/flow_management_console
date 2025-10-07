import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useClient, useCreateClient, useUpdateClient } from '@/hooks/useClient'
import type { CreateClientInput, UpdateClientInput } from '@/core/models/Client'
import { ClientSchema } from '@/core/models/Client'
import { ArrowLeft, Save } from 'lucide-react'

export function ClientForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id

  const { data: client, isLoading: isLoadingClient } = useClient(id || '')
  const createClientMutation = useCreateClient()
  const updateClientMutation = useUpdateClient()

  const form = useForm<CreateClientInput | UpdateClientInput>({
    resolver: zodResolver(ClientSchema.partial()),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      },
    },
  })

  useEffect(() => {
    if (isEditing && client) {
      form.reset(client)
    }
  }, [isEditing, client, form])

  const onSubmit = async (data: CreateClientInput | UpdateClientInput) => {
    try {
      if (isEditing && id) {
        await updateClientMutation.mutateAsync({ id, input: data as UpdateClientInput })
      } else {
        await createClientMutation.mutateAsync(data as CreateClientInput)
      }
      navigate('/clients')
    } catch (error) {
      console.error('Failed to save client:', error)
    }
  }

  if (isEditing && isLoadingClient) {
    return (
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h6 className="text-muted">Loading client data...</h6>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="row">
      <div className="col-12">
        {/* Header */}
        <div className="d-flex align-items-center mb-4">
          <button
            onClick={() => navigate('/clients')}
            className="btn btn-outline-secondary me-3"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h4 className="mb-1">
              {isEditing ? 'Edit Client' : 'Add New Client'}
            </h4>
            <p className="text-muted">
              {isEditing ? 'Update client information' : 'Enter client details to get started'}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="card">
          <div className="card-body">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Basic Information */}
              <div className="mb-4">
                <h6 className="mb-3 text-primary border-bottom pb-2">Basic Information</h6>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">
                      Client Name <span className="text-danger">*</span>
                    </label>
                    <input
                      id="name"
                      {...form.register('name')}
                      className="form-control"
                      placeholder="Enter client name"
                    />
                    {form.formState.errors.name && (
                      <div className="text-danger small mt-1">{form.formState.errors.name.message}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="company" className="form-label">Company</label>
                    <input
                      id="company"
                      {...form.register('company')}
                      className="form-control"
                      placeholder="Enter company name"
                    />
                    {form.formState.errors.company && (
                      <div className="text-danger small mt-1">{form.formState.errors.company.message}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-4">
                <h6 className="mb-3 text-primary border-bottom pb-2">Contact Information</h6>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      {...form.register('email')}
                      className="form-control"
                      placeholder="client@example.com"
                    />
                    {form.formState.errors.email && (
                      <div className="text-danger small mt-1">{form.formState.errors.email.message}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input
                      id="phone"
                      {...form.register('phone')}
                      className="form-control"
                      placeholder="+1 (555) 123-4567"
                    />
                    {form.formState.errors.phone && (
                      <div className="text-danger small mt-1">{form.formState.errors.phone.message}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="mb-4">
                <h6 className="mb-3 text-primary border-bottom pb-2">Address Information</h6>
                <div className="row">
                  <div className="col-12 mb-3">
                    <label htmlFor="street" className="form-label">Street Address</label>
                    <input
                      id="street"
                      {...form.register('address.street')}
                      className="form-control"
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="city" className="form-label">City</label>
                    <input
                      id="city"
                      {...form.register('address.city')}
                      className="form-control"
                      placeholder="New York"
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="state" className="form-label">State</label>
                    <input
                      id="state"
                      {...form.register('address.state')}
                      className="form-control"
                      placeholder="NY"
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label htmlFor="zipCode" className="form-label">ZIP Code</label>
                    <input
                      id="zipCode"
                      {...form.register('address.zipCode')}
                      className="form-control"
                      placeholder="10001"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="country" className="form-label">Country</label>
                    <input
                      id="country"
                      {...form.register('address.country')}
                      className="form-control"
                      placeholder="United States"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="d-flex justify-content-end gap-2 pt-3 border-top">
                <button
                  type="button"
                  onClick={() => navigate('/clients')}
                  className="btn btn-outline-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createClientMutation.isPending || updateClientMutation.isPending}
                  className="btn btn-primary"
                >
                  <Save className="h-4 w-4 me-2" />
                  {isEditing ? 'Update Client' : 'Create Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}