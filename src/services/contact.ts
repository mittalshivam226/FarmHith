import { z } from 'zod'
import { ContactMessage } from '../types'
import { logger } from '../utils/logger'
import { backendGet, backendPatch, backendPost } from './backendApi'

export interface ContactMessageData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

// Validation schema for contact messages
const contactMessageSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number (10 digits starting with 6-9)'),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message too long')
})

/**
 * Submits a new contact message
 * @param data - The contact message data to submit
 * @returns The created contact message record
 * @throws Error if validation fails or submission fails
 */
export const submitContactMessage = async (data: ContactMessageData): Promise<ContactMessage> => {
  try {
    // Validate input data
    const validatedData = contactMessageSchema.parse(data)

    const backendResponse = await backendPost<ContactMessageData, { id: string; status: string }>(
      '/contact-messages',
      validatedData
    )

    const message: ContactMessage = {
      id: backendResponse.id,
      status: backendResponse.status,
      created_at: new Date().toISOString(),
      ...validatedData,
    }

    logger.info('Contact message submitted successfully', {
      id: message.id,
      email: data.email,
    })

    return message
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.error('Contact message validation failed', {
        issues: error.issues,
        email: data.email,
      })
      throw new Error(`Validation failed: ${error.issues.map((e) => e.message).join(', ')}`)
    }
    throw error
  }
}

/**
 * Retrieves all contact messages for admin management
 * @returns Array of all contact message records
 */
export const getAllContactMessages = async (): Promise<ContactMessage[]> => {
  try {
    const messages = await backendGet<ContactMessage[]>('/contact-messages')

    logger.info('Contact messages fetched successfully', { count: messages.length })
    return messages
  } catch (error) {
    logger.error('Error fetching contact messages', { error: error instanceof Error ? error.message : String(error) })
    throw error
  }
}

/**
 * Updates a contact message's status
 * @param id - Contact message ID
 * @param status - New status
 * @returns Updated contact message record
 */
export const updateContactMessageStatus = async (id: string, status: string): Promise<ContactMessage> => {
  try {
    const message = await backendPatch<{ status: string }, ContactMessage>(
      `/contact-messages/${id}/status`,
      { status }
    )

    logger.info('Contact message status updated successfully', {
      id,
      status,
    })

    return message
  } catch (error) {
    logger.error('Error updating contact message', { error: error instanceof Error ? error.message : String(error) })
    throw error
  }
}
