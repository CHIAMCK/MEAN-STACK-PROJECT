'use strict';

module.exports = {
	app: {
		title: 'MEAN STACK PROJECT',
		description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
                'public/lib/angular-block-ui/dist/angular-block-ui.css',
                'public/lib/font-awesome/css/font-awesome.css',
                'public/lib/font-awesome/fonts/*.*',
                'public/lib/angular-loading-bar/build/loading-bar.css',
                'public/lib/bootstrap-daterangepicker/daterangepicker.css'
            ],
			js: [
				'public/lib/angular/angular.js',
                'public/lib/jquery/dist/jquery.js',
                'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
                'public/lib/angular-ui-utils/ui-utils.js',
                'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
                'public/lib/angular-smart-table/dist/smart-table.js',
                'public/lib/ac-category/ac-category.js',
                'public/lib/ac-edit-page/ac-edit-page.js',
                'public/lib/ac-list-page/ac-list-page.js',
                'public/lib/angular-block-ui/dist/angular-block-ui.js',
                'public/lib/angular-prompt/dist/angular-prompt.js',
                'public/lib/moment/moment.js',
                'public/lib/angular-loading-bar/build/loading-bar.js',
                'public/lib/bootstrap-daterangepicker/daterangepicker.js',
                'public/lib/angular-daterangepicker/js/angular-daterangepicker.js',
				'public/lib/angularjs-dropdown-multiselect/src/angularjs-dropdown-multiselect.js',
                'public/lib/angular-file-saver/dist/angular-file-saver.bundle.js'


            ]
		},
		css: [
			'public/modules/**/css/*.css',
             'public/assets/css/custom.css'

		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
