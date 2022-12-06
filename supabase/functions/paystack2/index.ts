// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";

console.log("Hello from Functions!");

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers":
		"authorization, Content-Type, x-client-info, apikey",
	"Content-Type": "application/json",
};

serve(
	async (req: {
		method: string;
		json: () =>
			| PromiseLike<{ email: any; amount: any }>
			| { email: any; amount: any };
	}) => {
		if (req.method === "OPTIONS") {
			return new Response("ok", { headers: corsHeaders });
		}

		try {
			const { email, amount } = await req.json();
			const resp = await fetch(
				"https://api.paystack.co/transaction/initialize/",
				{
					method: "POST",
					headers: {
						authorization: `Bearer ${Deno.env.get("PAYSTACK_SK")}`,
						"content-type": "application/json",
					},
					body: JSON.stringify({ email: email, amount: amount }),
				}
			);
			const paystackRes = await resp.json();

			return new Response(JSON.stringify(paystackRes), {
				headers: corsHeaders,
				status: 200,
			});
		} catch (error) {
			return new Response(JSON.stringify({ error: error.message }), {
				headers: corsHeaders,
				status: 400,
			});
		}
	}
);
