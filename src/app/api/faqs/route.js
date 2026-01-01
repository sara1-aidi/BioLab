import { supabase } from '../../lib/supabase';
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('created_at', { ascending: false })

    return error 
      ? Response.json({ error: error.message }, { status: 500 })
      : Response.json(data)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const { question, answer } = await request.json()
    const { data, error } = await supabase
      .from('faqs')
      .insert([{ question, answer }])
      .select()

    return error
      ? Response.json({ error: error.message }, { status: 500 })
      : Response.json(data[0])
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const { id, ...updateData } = await request.json()
    const { data, error } = await supabase
      .from('faqs')
      .update(updateData)
      .eq('id', id)
      .select()

    return error
      ? Response.json({ error: error.message }, { status: 500 })
      : Response.json(data[0])
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json()
    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', id)

    return error
      ? Response.json({ error: error.message }, { status: 500 })
      : Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}