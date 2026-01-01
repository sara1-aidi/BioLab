import { supabase } from '../../lib/supabase';


export async function GET() {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    return error 
      ? Response.json({ error: error.message }, { status: 500 })
      : Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from('contacts')
      .insert([{
        name: body.name,
        email: body.email,
        problem: body.problem,
        status: 'pending',
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json(data[0]);
    
  } catch (error) {
    console.error('Server error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, status } = await request.json();
    const { error } = await supabase
      .from('contacts')
      .update({ status })
      .eq('id', id);

    return error
      ? Response.json({ error: error.message }, { status: 500 })
      : Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}