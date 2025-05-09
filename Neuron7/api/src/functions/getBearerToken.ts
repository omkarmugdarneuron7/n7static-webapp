import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import config from "./config";
import fetch from "node-fetch"; // Ensure this is installed

export async function getBearerToken(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("Processing getBearerToken request...");

  // Tenant validation logic
  const user = req.headers["x-ms-client-principal"];
  if (!user) {
    return {
      status: 401,
      body: "Unauthorized: Missing client principal header",
    };
  }

  const decoded = Buffer.from(user, "base64").toString("ascii");
  const userInfo = JSON.parse(decoded);

  const tenantId = userInfo.identityProvider.split("/")[3];
  const allowedTenants = ["1cbde2c8-de37-43ad-ae97-b30d954200ac"];

  if (!allowedTenants.includes(tenantId)) {
    context.log("Forbidden: Tenant not allowed");
    return {
      status: 403,
      body: "Forbidden: Tenant not allowed",
    };
  }

  // Authentication URL
  const authUrl = `${config.N7BaseUrl}/security/user/authenticate`;
  try {
    // Authenticate with N7 API using credentials
    const authRes = await fetch(authUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName: config.N7Username, password: config.N7Password }), // Use the environment variables here
    });
 
    const authResBody = await authRes.text();
    const bearerToken = authRes.headers.get("Authorization")?.replace("Bearer ", "");
    if (!bearerToken) {
      context.log("Failed to retrieve bearer token:", authResBody);
      return {
        status: 401,
        body: JSON.stringify({ error: "Unauthorized: Token not received from Neuron7" }),
        headers: {
          "Content-Type": "application/json",
        },
      };
    }
 
    context.log("Successfully retrieved bearer token.");
    return {
      status: 200,
      body: JSON.stringify({
        bearerToken,
        baseUrl: config.N7BaseUrl
      }), // Serialize the response body as JSON
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    context.log("Error during authentication:", error);
    return {
      status: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
}
 
app.http("getBearerToken", {
  methods: ['GET', 'POST'],
  authLevel: "anonymous",
  handler: getBearerToken,
});