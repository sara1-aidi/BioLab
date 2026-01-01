import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get('specialty');

    let query = supabase.from('doctors').select('*');

    if (specialty && specialty !== 'all') {
      query = query.ilike('specialty', `%${specialty}%`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, specialty, distance, rating, phone_number } = body;

    if (!name || !specialty || !distance || !rating || !phone_number) {
      throw new Error('Missing required fields');
    }

    const { data, error } = await supabase
      .from('doctors')
      .insert({ name, specialty, distance, rating, phone_number })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create doctor' },
      { status: 400 }
    );
  }
}

export async function PUT(request) {
  try {
    const { id, ...updateData } = await request.json();
    
    const { data, error } = await supabase
      .from('doctors')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to update doctor' },
      { status: 400 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    
    const { error } = await supabase
      .from('doctors')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete doctor' },
      { status: 400 }
    );
  }
}