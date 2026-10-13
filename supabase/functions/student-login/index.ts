import { createClient } from "https://esm.sh/@supabase/supabase-js@2.117.2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { phone } = await req.json();

    if (!phone) {
      return new Response(JSON.stringify({ error: "Phone number required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Use service role to check enrollments and create session
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Look up the student by phone
    const { data: enrollment, error: enrollError } = await supabase
      .from("enrollments")
      .select("id, email, phone")
      .eq("phone", phone)
      .single();

    if (enrollError || !enrollment) {
      return new Response(
        JSON.stringify({
          error: "এই ফোন নম্বরে কোনো এনরোলমেন্ট খুঁজে পাওয়া যায়নি।",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create or get auth user for this student
    const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(enrollment.id);

    let userId: string;

    if (authError || !authUser) {
      // Create a new auth user with the student's email
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: enrollment.email,
        email_confirm: true, // Auto-confirm to allow immediate login
        user_metadata: { phone: enrollment.phone },
      });

      if (createError || !newUser) {
        return new Response(
          JSON.stringify({ error: "লগইন ব্যর্থ। আবার চেষ্টা করুন।" }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      userId = newUser.user!.id;
    } else {
      userId = authUser.user.id;
    }

    // Create a session for this user
    const { data: session, error: sessionError } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: enrollment.email,
      options: {
        redirectTo: `${new URL(req.url).origin}/dashboard`,
      },
    });

    if (sessionError || !session) {
      return new Response(
        JSON.stringify({ error: "লগইন ব্যর্থ। আবার চেষ্টা করুন।" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return the login link and user info
    return new Response(
      JSON.stringify({
        success: true,
        userId,
        email: enrollment.email,
        phone: enrollment.phone,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
