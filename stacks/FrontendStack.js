import { StaticSite, use } from "sst/constructs";
import { ApiStack } from "./ApiStack";
import { AuthStack } from "./AuthStack";

export function FrontendStack({ stack, app }) {
  const { api } = use(ApiStack);
  const { auth } = use(AuthStack);

  // Define our React app
  const site = new StaticSite(stack, "ReactSite", {
    customDomain:
      app.stage === "prod"
        ? {
          domainName: "alleswriting.net",
          domainAlias: "www.alleswriting.net",
        }
        : undefined,
    path: "frontend",
    buildOutput: "build",
    buildCommand: "npm run build",
    // Pass in our environment variables
    environment: {
      REACT_APP_API_URL: api.customDomainUrl || api.url,
      REACT_APP_REGION: app.region,
      REACT_APP_USER_POOL_ID: auth.userPoolId,
      REACT_APP_IDENTITY_POOL_ID: auth.cognitoIdentityPoolId,
      REACT_APP_USER_POOL_CLIENT_ID: auth.userPoolClientId,
    },
  });

  // Show the url in the output
  stack.addOutputs({
    SiteUrl: site.customDomainUrl || site.url || "http://localhost:3000",
  });
}