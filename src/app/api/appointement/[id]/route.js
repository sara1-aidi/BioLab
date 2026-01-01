import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function PUT(request, { params }) {
  try {
    const { id } = params
    const body = await request.json()
    
    const { data, error } = await supabase
      .from('appointments')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)

    if (error) throw error
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}