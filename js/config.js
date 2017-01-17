'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp.config', [])

	// version of this seed app is compatible with angularFire 0.6
	// see tags for other versions: https://github.com/firebase/angularFire-seed/tags
	.constant('version', '0.6')

	// where to redirect users if they need to authenticate (see module.routeSecurity)
	.constant('loginRedirectPath', '/login')

	// acceso local
	//.constant('URL', 'http://eneresi.rocks/bend/')
	.constant('URL', 'http://eneresi.local/bend/')
	.constant('URL_COMPRAS', 'http://eneresi.local/bendmall/')
	.constant('URL_STATS', 'http://eneresi.local/bendstats/')
	.constant('URL_TABLEAU', 'http://eneresi.local/bendcontrol/')

	// acceso remoto
	// .constant('URL', 'http://eneresi.rocks/bend/')
	// .constant('URL_COMPRAS', 'http://eneresi.rocks/bendmall/')
	// .constant('URL_STATS', 'http://eneresi.rocks/bendstats/')
	// .constant('URL_TABLEAU', 'http://eneresi.rocks/bendcontrol/')

	//you can use this one to try out a demo of the seed
	//   .constant('FBURL', 'https://angularfire-seed.firebaseio.com');
	.constant('AUTH_EVENTS', {
		loginSuccess: 'auth-login-success',
		loginFailed: 'auth-login-failed',
		logoutSuccess: 'auth-logout-success',
		sessionTimeout: 'auth-session-timeout',
		notAuthenticated: 'auth-not-authenticated',
		notAuthorized: 'auth-not-authorized'
	});

