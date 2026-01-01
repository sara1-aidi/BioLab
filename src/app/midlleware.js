import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const { data: { session } } = await supabase.auth.getSession();
  const path = req.nextUrl.pathname;

  // Define access rules with redirect reasons
  const accessRules = {
    '/AI': { 
      allowed: ['booked', 'paid'],
      role: 'patient',
      redirect: '/required?reason=ai_access'
    },
    '/faq': {
      allowed: ['paid'],
      role: 'patient',
      redirect: '/required?reason=premium_content'
    },
    '/medical-assistance': {
      allowed: ['paid'],
      role: 'patient',
      redirect: '/required?reason=medical_access'
    },
    '/admin': {
      allowed: ['admin'],
      role: 'admin',
      redirect: '/unauthorized'
    }
  };

  // Redirect unauthenticated users
  if (!session?.user) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, patient_type')
    .eq('id', session.user.id)
    .single();

  // Check access rules
  for (const [route, rule] of Object.entries(accessRules)) {
    if (path.startsWith(route)) {
      // Allow admin access to all non-admin routes
      if (profile?.role === 'admin' && route !== '/admin') continue;
      
      // Role check
      if (profile?.role !== rule.role) {
        return NextResponse.redirect(new URL(rule.redirect, req.url));
      }

      // Patient type check
      if (rule.role === 'patient' && !rule.allowed.includes(profile?.patient_type)) {
        return NextResponse.redirect(new URL(rule.redirect, req.url));
      }
    }
  }

  // Patient open routes (accessible to all patient types)
  const patientOpenRoutes = ['/appointments', '/contact-admin', '/scan', '/upgrade'];
  if (patientOpenRoutes.some(route => path.startsWith(route))) {
    if (profile?.role !== 'patient') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
  }

  return res;
}