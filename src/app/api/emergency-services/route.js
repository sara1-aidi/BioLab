import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    let query = supabase.from('emergency_services').select('*');

    if (type && type !== 'all') {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, type, distance, phone_number } = body;

    if (!name || !type || !distance || !phone_number) {
      throw new Error('Missing required fields');
    }

    const { data, error } = await supabase
      .from('emergency_services')
      .insert({ name, type, distance, phone_number })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create service' },
      { status: 400 }
    );
  }
}

export async function PUT(request) {
  try {
    const { id, ...updateData } = await request.json();
    
    const { data, error } = await supabase
      .from('emergency_services')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to update service' },
      { status: 400 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    
    const { error } = await supabase
      .from('emergency_services')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete service' },
      { status: 400 }
    );
  }
}