// app/api/addToWaitlist/route.js
import axios from "axios";

export async function POST(req) {
  const body = await req.json();
  const { name, email } = body;

  console.log("Incoming POST:", { name, email });

  if (!name || !email) {
    return new Response(
      JSON.stringify({ error: "Name and email required" }),
      { status: 400 }
    );
  }

  try {
    // Step 1: Login to Django
    const loginRes = await axios.post(
      "http://147.182.145.237:8000/api/auth/login/",
      {
        username: process.env.WAITLIST_ADMIN_USERNAME,
        password: process.env.WAITLIST_ADMIN_PASSWORD,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const accessToken = loginRes.data.tokens.access;

    if (!accessToken) {
      console.error("No access token returned from Django login");
      return new Response(
        JSON.stringify({ error: "Failed to get access token" }),
        { status: 500 }
      );
    }

    console.log("Access token received");

    // Step 2: Submit waitlist entry
    const waitlistRes = await axios.post(
      "http://147.182.145.237:8000/waitlist/",
      { name, email },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Waitlist response:", waitlistRes.status, waitlistRes.data);

    return new Response(
      JSON.stringify({ message: "Successfully signed up!" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error submitting waitlist:", err.response?.data || err.message);
    return new Response(
      JSON.stringify({ error: "Failed to submit waitlist entry" }),
      { status: 500 }
    );
  }
}
