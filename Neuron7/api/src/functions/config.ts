const config = {
  authorityHost: process.env.M365_AUTHORITY_HOST,
  tenantId: process.env.M365_TENANT_ID,
  clientId: process.env.M365_CLIENT_ID,
  clientSecret: process.env.M365_CLIENT_SECRET,

    // Fetch environment variables (set via Azure Function App Configuration)
    N7Username: process.env.N7Username, // Username from Azure environment variable
    N7Password: process.env.N7Password, // Password from Azure environment variable
    N7BaseUrl: process.env.N7BaseUrl, // API Base URL from Azure environment variable
};

export default config;
