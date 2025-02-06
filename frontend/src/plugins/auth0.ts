import { createAuth0 } from '@auth0/auth0-vue';

export default createAuth0({
  domain: 'dev-deemohuang.ca.auth0.com',
  clientId: 'cuIdpMytymQHeqULPau2DvsfhGnztv2T',
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: 'https://deemo-portfolio.com'
  }
});