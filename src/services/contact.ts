import { z } from 'zod'
import { supabase } from '../lib/supabase'
import { ContactMessage } from '../types'
import { logger } from '../utils/logger'

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

    const { data: message, error } = await supabase
      .from('contact_messages')
      .insert([validatedData])
      .select()
      .single()

    if (error) {
      logger.error('Database error submitting contact message', {
        error: error.message,
        email: data.email,
      })
      throw new Error('Failed to send message. Please try again.')
    }

    logger.info('Contact message submitted successfully', {
      id: message.id,
      email: data.email,
    })

    return message as ContactMessage
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
    const { data: messages, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      logger.error('Database error fetching contact messages', { error: error.message })
      throw new Error('Failed to fetch contact messages.')
    }

    logger.info('Contact messages fetched successfully', { count: messages.length })

    return messages as ContactMessage[]
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
    const { data: message, error } = await supabase
      .from('contact_messages')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      logger.error('Database error updating contact message', {
        error: error.message,
        id,
        status,
      })
      throw new Error('Failed to update contact message.')
    }

    logger.info('Contact message status updated successfully', {
      id,
      status,
    })

    return message as ContactMessage
  } catch (error) {
    logger.error('Error updating contact message', { error: error instanceof Error ? error.message : String(error) })
    throw error
  }
}
