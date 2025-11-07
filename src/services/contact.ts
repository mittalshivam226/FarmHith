import { supabase } from '../lib/supabase'
import { ContactMessage } from '../types'

export interface ContactMessageData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

/**
 * Submits a new contact message
 * @param data - The contact message data to submit
 * @returns The created contact message record
 * @throws Error if submission fails
 */
export const submitContactMessage = async (data: ContactMessageData): Promise<ContactMessage> => {
  const { data: message, error } = await supabase
    .from('contact_messages')
    .insert([data])
    .select()
    .single()

  if (error) {
    console.error('Error submitting contact message:', error)
    throw new Error('Failed to send message. Please try again.')
  }

  return message as ContactMessage
}

/**
 * Retrieves all contact messages for admin management
 * @returns Array of all contact message records
 */
export const getAllContactMessages = async (): Promise<ContactMessage[]> => {
  const { data: messages, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching contact messages:', error)
    throw new Error('Failed to fetch contact messages.')
  }

  return messages as ContactMessage[]
}

/**
 * Updates a contact message's status
 * @param id - Contact message ID
 * @param status - New status
 * @returns Updated contact message record
 */
export const updateContactMessageStatus = async (id: string, status: string): Promise<ContactMessage> => {
  const { data: message, error } = await supabase
    .from('contact_messages')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating contact message:', error)
    throw new Error('Failed to update contact message.')
  }

  return message as ContactMessage
}
