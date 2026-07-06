export const authConfig = {
  clientId: 'oauth2-pkce-client',
  authorizationEndpoint: 'http://34.66.134.253:8181/realms/fitness-oauth2/protocol/openid-connect/auth',
  tokenEndpoint: 'http://34.66.134.253:8181/realms/fitness-oauth2/protocol/openid-connect/token',
  logoutEndpoint: 'http://34.66.134.253:8181/realms/fitness-oauth2/protocol/openid-connect/logout',
  redirectUri: 'http://34.66.134.253:5173/',
  postLogoutRedirectUri: 'http://34.66.134.253:5173/',
  scope: 'openid profile email offline_access',
  onRefreshTokenExpire: (event) => event.logIn(),
}