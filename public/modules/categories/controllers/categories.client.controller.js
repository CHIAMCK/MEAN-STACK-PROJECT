'use strict';

// Categories controller
angular.module('categories')
	.controller('CategoriesController', ['$scope', '$state', '$controller', '$stateParams', '$location', '$http', 'Authentication', 'Categories', 'acCategory', 'blockUI',
		function($scope, $state, $controller, $stateParams, $location, $http, Authentication, Categories, acCategory, blockUI) {

			$scope.authentication = Authentication;
	  		$scope.currentPage = 1;
	  		$scope.pageSize = 20;
	  		$scope.offset = 0;
        	$scope.selectedCategory = null;
        	$scope.selectedIndex = null;
       	 	$scope.rowCollection = [];
       	 	$scope.itemsByPage=20;


            $scope.rowCollection = Categories.query();

	  		// Page changed handler
	  		$scope.pageChanged = function() {
	   		$scope.offset = ($scope.currentPage - 1) * $scope.pageSize;
	  		};

            // Find a list of Categories
			/*
            $scope.find = function() {
                $scope.categories = Categories.query();
            };
            */

	  		$scope.listOptions = {
                module:'category', title: 'Category', url: 'categories', 'local_url': 'categories',
                viewController: $controller('CategoriesViewController', {$scope: $scope}),
                viewHtml: '/lib/ac-category/view-category.client.view.html',
				addHtml : '/modules/categories/views/create-category.client.view.html',
				addController: $controller('CategoriesCreateController', {$scope: $scope}),
                editHtml : '/modules/categories/views/edit-category.client.view.html',
                editController: $controller('CategoriesEditController', {$scope: $scope})
			};

	  		$scope.retrieve = function () {
                blockUI.start();
                $http({
                    url: 'categories',
                    method: 'GET',
                }).then(function (resp) {
                    var ret = resp ? resp.data : null;
                    if (ret && Object.keys(ret).length !== 0) {
                        $scope.items = ret;
                    } else {
                        $scope.items = [];
                    }
                    blockUI.stop();
                    $scope.selectedId = $scope.items[0]._id;
                    $scope.selectedCategory = $scope.items[0];
                    $scope.total = $scope.items.length;
                    $scope.listPageMode = 'page';
                    $scope.viewPageMode = 'page';


                }, function(err, status){
                    $scope.items = [];
                    blockUI.stop();
                });

			};

	  		$scope.filterListView = function (params, ctrl, noRefreshView) {
                if (params && params.pagination && !params.pagination.number) {
                    params.pagination.number = 20;
                }
                blockUI.start();
                $http({
                    url: 'categories',
                    method: 'GET',
                    params: {tableState: JSON.stringify(params)}
                }).then(function (resp) {
                    var ret = resp ? resp.data : null;
                    if (ret && Object.keys(ret).length !== 0) {
                        $scope.items = ret.items;
                        $scope.total = ret.count;
                        if (params && params.pagination.number) {
                            params.pagination.numberOfPages = Math.ceil(ret.count / params.pagination.number);
                            params.pagination.count = ret.count;
                            params.pagination.page = Math.ceil((params.pagination.start+1)/params.pagination.number);
                        }
                    } else {
                        $scope.items = [];
                    }
                    blockUI.stop();
                    $scope.selectedId = $scope.items[0]._id;
                    $scope.selectedCategory = $scope.items[0];
                    if (!$scope.listPageMode) {
                        $scope.listPageMode = 'page';
                    }
                    if (!$scope.viewPageMode) {
                        $scope.viewPageMode = 'page';
                    }
                    $scope.scrollTop();

                }, function(err, status){
                    $scope.items = [];
                    blockUI.stop();
                });

            };

            $scope.resetSmartTableSearch = function() {
                $scope.date = '';
            };

            $scope.listViewAdd = function () {
	  			$scope.addEnabled = true;

            };

	  		$scope.listPageChange = function () {
	  		    if ($scope.listPageMode === 'list') {
                    $scope.listPageMode = 'page';
                } else {
                    $scope.listPageMode = 'list';
                }
            };

            $scope.scrollTop = function () {
                 // var container = angular.element(document.getElementById('tablelist'));
                // container.scrollTop(0,0);
                $('div.panel-body').scrollTop(0);
            };

            $scope.date = {
                startDate: '',
                endDate: ''
            };

            /*
            // Create new Category
            $scope.create = function() {
                // Create new Category object
                var category = new Categories ({
                    name: this.name,
                    description: this.description
                });

                // Redirect after save
                category.$save(function(response) {
                    $location.path('categories/' + response._id);

                    // Clear form fields
                    $scope.name = '';
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };

            // Remove existing Category
            $scope.remove = function(category) {
                if ( category ) {
                    category.$remove();

                    for (var i in $scope.categories) {
                        if ($scope.categories [i] === category) {
                            $scope.categories.splice(i, 1);
                        }
                    }
                    $scope.selectedCategory = "";
                } else {
                    $scope.category.$remove(function() {
                        $location.path('categories');
                    });
                }
            };

            // Update existing Category
            $scope.update = function() {
                var category = $scope.category;

                category.$update(function() {
                    $location.path('categories/' + category._id);
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };




            // Search for a category
            $scope.categorySearch = function(product) {
                $location.path('categories/' + product._id);
            };

            */

            $scope.selectCategory = function(category, index) {
                $scope.selectedIndex = index;
                $scope.selectedCategory = category;
                $scope.selectedId = category._id;
                $scope.addEnabled = false;
                $scope.editEnabled = false;
                $scope.successSave = false;
                $scope.error ='';
                this.setSelectedId();

            };

            $scope.setSelectedId = function () {
                var params = {'#':$scope.selectedId};
                $state.go($state.current.name, params, {location: 'replace', reload:false, inherit: false, notify: false});
            };

		}
	])
	.controller('CategoriesViewController', ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'Categories', 'blockUI','prompt',
    	function($scope, $stateParams, $location, $window, Authentication, Categories, blockUI, prompt) {

	        $scope.editCategory = function () {
	            $scope.editEnabled = true;
            };

            $scope.ViewPageChange = function () {
                if ($scope.viewPageMode === 'list') {
                    $scope.viewPageMode = 'page';
                } else {
                    $scope.viewPageMode = 'list';
                }
            };

            // Remove existing Category
            $scope.remove = function(selectedCategory ) {

                prompt({
                    title: 'Delete this?',
                    message: 'Are you sure?'
                }).then(function(result){
                    //he hit ok and not cancel
                    if (result.primary) {

                        Categories.delete({
                            categoryId: $scope.selectedCategory._id
                        });

                        for (var i in $scope.items) {
                            if ($scope.items [i] === $scope.selectedCategory) {
                                $scope.items.splice(i, 1);
                            }
                        }
                        $window.location.reload();

                    }
                });

                /*
                $scope.category = Categories.delete({
                    categoryId: $scope.selectedCategory._id
                });

                for (var i in $scope.items) {
                    if ($scope.items [i] === $scope.selectedCategory) {
                        $scope.items.splice(i, 1);
                    }
                }
                $window.location.reload();
                */
            };
    	}
    ])
    .controller('CategoriesCreateController', ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'Categories', 'blockUI', '$http',
        function($scope, $stateParams, $location, $window , Authentication, Categories, blockUI, $http) {

            $scope.optionsModel = {};
            $scope.roleOptions = [ {id: 1, label: "Administrator"}, {id: 2, label: "Approver"}, {id: 3, label: "Creator"},  {id: 4, label: "User"}];
            $scope.optionsSettings = { externalIdProp : '', closeOnSelect:true ,selectionLimit: 1, smartButtonMaxItems: 3, smartButtonTextConverter: function(itemText, originalItem) { if (itemText === 'Jhon') { return 'Jhonny!'; } return itemText; }};


            $scope.save = function () {
                /*
                var formData = new FormData();
                var image = document.getElementById('file').files[0];
                formData.append('name',this.name);
                formData.append('description', this.description);
                formData.append('file', image);

                $http.post('/categories', formData, {
                    headers: {
                       'Content-Type': undefined
                    },
                    transformRequest: angular.identity
                }).then(function (res){

                });
                */

            var category = new Categories ({
               name: this.name,
               description: this.description,
               updated: Date.now,
               role: $scope.optionsModel.label,
               updatedBy: $scope.authentication.user._id
            });

            category.$save(function(response) {
                $scope.addEnabled = false;
                $scope.successSave = true;
                setTimeout(function(){ $window.location.reload(); }, 1000);
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });

        };
        }
    ])
    .controller('CategoriesEditController', ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'Categories', 'blockUI',
        function($scope, $stateParams, $location, $window , Authentication, Categories, blockUI) {

            // Find existing Category
            $scope.findOne = function() {
                $scope.category = Categories.get({
                    categoryId: $scope.selectedCategory._id
                });
            };


            // Update existing Category
            $scope.update = function() {
                var category = $scope.category;

                category.$update(function() {
                    $window.location.reload();
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            };

            $scope.view = function() {
                $scope.editEnabled = false;
            };


        }
    ])
;
