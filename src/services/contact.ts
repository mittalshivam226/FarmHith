import { supabase } from '../lib/supabase'

export interface ContactMessageData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export const submitContactMessage = async (data: ContactMessageData) => {
  const { data: message, error } = await supabase
    .from('contact_messages')
    .insert([data])
    .select()
    .single()

  if (error) {
    console.error('Error submitting contact message:', error)
    throw new Error('Failed to send message. Please try again.')
  }

  return message
}
