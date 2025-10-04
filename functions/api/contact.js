// /functions/api/contact.js
// This function logs to D1 and then redirects the user back to the home page (/).

export async function onRequest(context) {
    const { request, env } = context;

    try {
        const formData = await request.formData();
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // --- D1 DATABASE INSERT (Logging the entry) ---
        if (env.DB) { // Make sure this binding exists for BayouSno.co
            const timestamp = new Date().toISOString();
            
            const { error } = await env.DB.prepare(
                "INSERT INTO contacts (name, email, message, timestamp) VALUES (?, ?, ?, ?)"
            ).bind(name, email, message, timestamp).run();

            if (error) {
                console.error("D1 Insert Error:", error);
            }
        } else {
            console.error("D1 binding (env.DB) is missing!");
        }
        
        // --- REDIRECT TO BAYOUSNO.CO HOME PAGE ---
        return Response.redirect("https://bayousno.co/", 302);

    } catch (error) {
        console.error("Function Error:", error);
        // Redirect to home page with error status
        return Response.redirect("https://bayousno.co/?status=error", 302);
    }
}
