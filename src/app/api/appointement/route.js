import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    let query = supabase.from('appointments').select(`
      *,
      patients(full_name, email, contact_number)
    `); // Removed feedback join

    if (email) query = query.eq('patients.email', email);

    const { data, error } = await query;

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      date,
      time,
      contactNumber,
      reasonForScan,
      dateOfBirth,
      gender,
      priority = 'normal'
    } = body;

    // Validate required fields
    if (!fullName || !email || !date || !time || !contactNumber || !reasonForScan || !dateOfBirth || !gender) {
      throw new Error('Missing required fields');
    }

    // Check if patient exists
    let { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id')
      .eq('email', email)
      .single();

    if (patientError && patientError.code !== 'PGRST116') throw patientError;

    // Create patient if doesn't exist
    if (!patient) {
      const { data: newPatient, error: insertError } = await supabase
        .from('patients')
        .insert({
          full_name: fullName,
          email,
          contact_number: contactNumber,
          date_of_birth: dateOfBirth,
          gender
        })
        .select('id')
        .single();

      if (insertError) throw insertError;
      patient = newPatient;
    }

    // Create appointment
    const appointmentData = {
      patient_id: patient.id,
      date,
      time,
      reason: reasonForScan,
      date_of_birth: dateOfBirth,
      gender,
      status: 'pending',
      priority
    };

    const { data, error } = await supabase
      .from('appointments')
      .insert(appointmentData)
      .select('*')
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create appointment' },
      { status: 400 }
    );
  }
}
