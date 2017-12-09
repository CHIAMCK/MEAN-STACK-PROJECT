'use strict';

// Users controller
angular.module('users')
    .controller('UsersController', ['$scope', '$state', '$controller', '$stateParams', '$location', '$http', 'Authentication', 'Users', 'blockUI', 'prompt', 'FileSaver',
        function($scope, $state, $controller, $stateParams, $location, $http, Authentication, Users, blockUI, prompt, FileSaver) {

            $scope.authentication = Authentication;
            $scope.currentPage = 1;
            $scope.pageSize = 20;
            $scope.offset = 0;
            $scope.selectedUser = null;
            $scope.selectedIndex = null;
            $scope.rowCollection = [];
            $scope.itemsByPage=20;

            $scope.optionsModel2 = {};
            $scope.roleOptions = [ {id: 1, label: "Administrator"}, {id: 2, label: "Approver"}, {id: 3, label: "Creator"},  {id: 4, label: "User"}];
            $scope.optionsSettings = { externalIdProp : '', closeOnSelect:true ,selectionLimit: 1, smartButtonMaxItems: 3, smartButtonTextConverter: function(itemText, originalItem) { return itemText; }};
            $scope.eventSetting = {onItemSelect: function (items) {$scope.roles = $scope.optionsModel2.label; $scope.editEnabled = false;}, onDeselectAll: function (items) {$scope.roles = '';}};

            $scope.rowCollection = Users.query();

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
                module:'user', title: 'User', url: 'users', 'local_url': 'users',
                viewController: $controller('UsersViewController', {$scope: $scope}),
                viewHtml: '/lib/ac-user/view-user.client.view.html',
                addHtml : '/modules/users/views/create-user.client.view.html',
                addController: $controller('UsersCreateController', {$scope: $scope}),
                editHtml : '/modules/users/views/edit-user.client.view.html',
                editController: $controller('UsersEditController', {$scope: $scope})
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
                    url: 'users',
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
                            $scope.params = params;
                        }
                    } else {
                        $scope.items = [];
                    }
                    blockUI.stop();
                    $scope.selectedId = $scope.items[0]._id;
                    setSelectedId();
                    $scope.selectedUser = $scope.items[0];
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
                $scope.optionsModel = {};
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

            $scope.selectUser = function(user, index) {
                $scope.selectedIndex = index;
                $scope.selectedUser = user;
                $scope.selectedId = user._id;
                $scope.addEnabled = false;
                $scope.editEnabled = false;
                $scope.successSave = false;
                $scope.error ='';
                setSelectedId();

            };

            var setSelectedId = function () {
                var params = {'#':$scope.selectedId};
                $state.go($state.current.name, params, {location: 'replace', reload:false, inherit: false, notify: false});
            };

            $scope.listViewExport = function(data) {
                var _this = this;
                if ($scope.params && $scope.params.pagination && $scope.params.pagination.count > 4000) {
                    alert('Cannot export more than 4000 rows! Please change your search criteria.');
                } else {
                    var message = {
                        title: 'Export',
                        message: 'Export now?',
                        buttons: [
                            {label:'Cancel',cancel:true, class:'btn-sm rounded'},
                            {label:'OK',primary:true, class:'btn-sm rounded'}]
                    };
                    prompt(message).then(function(result) {
                        if (result.primary) {
                            _this.exportData($scope.params, $scope.listOptions.url + '/export'+(data? '?'+data:''), function(err){
                                if (err) {
                                    console.log(err);
                                } else {
                                    $scope.error = '';
                                }
                            });

                        }

                    });
                }
            };


            $scope.exportData = function (params, url, cb) {
                var _this = this;
                blockUI.start();
                $http({
                    url: url,
                    method: 'GET',
                    //response will be binary data
                    responseType: 'arraybuffer',
                    params: {'tableState': JSON.stringify(params), 'importType':params.importType, 'importLabel':params.importLabel},
                    headers: {
                        //data type of the body of request
                        'Content-type': 'application/json',
                        //content type that is acceptable for the response
                        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    }
                }).then(function (resp) {
                    blockUI.stop();
                    if (resp) {
                        _this.exportFileAs(resp.data, resp.headers());
                    }
                    if (typeof cb !== 'undefined') {
                        cb(resp ? 0 : new Error('No data!'));
                    }
                }, function(err, status){
                    blockUI.stop();
                    if (typeof cb !== 'undefined') {
                        cb(err);
                    }
                });
            };

            $scope.exportFileAs = function(data, headers) {
                //A blob object represents a chuck of bytes that holds data of a file.
                var blob = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                var filename = null;
                if (headers['content-disposition']) {
                    // Perform a global replacement and split the string into an array of substrings by separator ;
                    var content = headers['content-disposition'].replace(/( |")/g, '').split(';');
                    angular.forEach(content, function (v) {
                        v = v.split('=');
                        if (v[0] === 'filename') {
                            //find the filename
                            filename = v[1];
                            return false;
                        }
                    });
                }
                if (filename) {
                    //Angular File Saver everages FileSaver.js and Blob.js to implement the HTML5 W3C saveAs() interface in browsers that do not natively support it
                    FileSaver.saveAs(blob, filename);
                } else {
                    window.open(URL.createObjectURL(blob));
                }
            };

        }
    ])
    .controller('UsersViewController', ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'Users', 'blockUI','prompt', '$http',
        function($scope, $stateParams, $location, $window, Authentication, Users, blockUI, prompt, $http) {

            $scope.editUser = function () {
                $scope.editEnabled = true;
            };

            $scope.ViewPageChange = function () {
                if ($scope.viewPageMode === 'list') {
                    $scope.viewPageMode = 'page';
                } else {
                    $scope.viewPageMode = 'list';
                }
            };

            // Remove existing User
            $scope.remove = function(selectedUser) {

                prompt({
                    title: 'Delete this?',
                    message: 'Are you sure?'
                }).then(function(result){
                    //he hit ok and not cancel
                    if (result.primary) {

                        Users.delete({
                            userId: $scope.selectedUser._id
                        });

                        for (var i in $scope.items) {
                            if ($scope.items [i] === $scope.selectedUser) {
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
    .controller('UsersCreateController', ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'Users', 'blockUI', 'acEdit',
        function($scope, $stateParams, $location, $window , Authentication, Users, blockUI, acEdit) {

            $scope.optionsModel = {};
            $scope.roleValue = $scope.optionsModel.label;
            $scope.roleOptions = [ {id: 1, label: "Administrator"}, {id: 2, label: "Approver"}, {id: 3, label: "Creator"},  {id: 4, label: "User"}];
            $scope.optionsSettings = { externalIdProp : '', closeOnSelect:true ,selectionLimit: 1, smartButtonMaxItems: 3, smartButtonTextConverter: function(itemText, originalItem) { if (itemText === 'Jhon') { return 'Jhonny!'; } return itemText; }};
            $scope.form = {};

                $scope.save = function () {
                    if ($scope.form && $scope.form.userForm) {
                        acEdit.reset($scope.form.userForm);
                        $scope.error = '';
                    }

                var user = new Users ({
                    phone: this.mobileNumber,
                    updated: Date.now,
                    email: this.email,
                    password: this.password,
                    username: this.name,
                    displayName : this.displayName,
                    roles: $scope.optionsModel.label,
                    updatedBy: $scope.authentication.user._id
                });


                user.$save(function(response) {
                    $scope.successSave = true;
                    setTimeout(function(){ $window.location.reload(); }, 1000);
                }, function(errorResponse) {
                    acEdit.setErrorFields($scope.form.userForm, $scope.form.userForm.$error);
                    $scope.error = errorResponse.data.message;
                });
            };
        }
    ])
    .controller('UsersEditController', ['$scope', '$stateParams', '$location', '$window', 'Authentication', 'Users', 'blockUI', 'acEdit',
        function($scope, $stateParams, $location, $window , Authentication, Users, blockUI, acEdit) {

            $scope.displayPassword = 'xxxxxx';
            $scope.passwordChanged = function(val) {
                $scope.user.password = val;
            };
            // Find existing User
            $scope.findOne = function() {
                $scope.user = Users.get({
                    userId: $scope.selectedUser._id
                });

                for (var i = 0 ; i < $scope.roleOptions.length ; i++) {
                        if ($scope.roleOptions[i].label === $scope.selectedUser.roles) {
                            $scope.optionsModel = angular.copy($scope.roleOptions[i]);
                            break;
                        } else {
                            continue;
                        }
                    }
            };

            // Update existing User
            $scope.update = function() {
                var user = $scope.user;
                user.roles = $scope.optionsModel.label;
                user.updatedBy = $scope.authentication.user._id;

                user.$update(function() {
                    $window.location.reload();
                }, function(errorResponse) {
                    acEdit.setErrorFields($scope.form.userForm, $scope.form.userForm.$error);
                    $scope.error = errorResponse.data.message;
                });
            };

            $scope.view = function() {
                $scope.editEnabled = false;
            };


        }
    ])
;
