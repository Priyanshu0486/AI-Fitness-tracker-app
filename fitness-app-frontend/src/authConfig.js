export const authConfig = {
  clientId: 'oauth2-pkce-client',
  authorizationEndpoint: 'https://priyanshu-fitness.duckdns.org/realms/fitness-oauth2/protocol/openid-connect/auth',
  tokenEndpoint: 'https://priyanshu-fitness.duckdns.org/realms/fitness-oauth2/protocol/openid-connect/token',
  logoutEndpoint: 'https://priyanshu-fitness.duckdns.org/realms/fitness-oauth2/protocol/openid-connect/logout',
  redirectUri: 'https://priyanshu-fitness.duckdns.org/',
  postLogoutRedirectUri: 'https://priyanshu-fitness.duckdns.org/',
  scope: 'openid profile email offline_access',
  onRefreshTokenExpire: (event) => event.logIn(),
}