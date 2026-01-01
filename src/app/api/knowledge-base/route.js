import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const tags = searchParams.get('tags');

    let query = supabase.from('knowledge_base').select('*');

    if (tags) {
      const tagArray = tags.split(',');
      query = query.contains('tags', tagArray);
    }

    const { data, error } = await query;

    if (error) throw error;
    return NextResponse.json(data || []);
    
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validation
    if (!body.title || !body.content || !body.type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('knowledge_base')
      .insert({
        ...body,
        tags: typeof body.tags === 'string' ? 
          body.tags.split(',').map(tag => tag.trim()) : 
          body.tags
      })
      .select('*')
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Creation failed' },
      { status: 400 }
    );
  }
}

export async function PUT(request) {
  try {
    const { id, ...updateData } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing item ID' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('knowledge_base')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw error;
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Update failed' },
      { status: 400 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: 'Missing item ID' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('knowledge_base')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Deletion failed' },
      { status: 400 }
    );
  }
}