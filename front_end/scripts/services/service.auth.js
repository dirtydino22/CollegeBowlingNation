'use strict';
angular.module('service.auth', [])
	.factory('Auth', function(AppUser, Session, Socket, User, TempUser, growlNotifications) {
		return {
			/**
	         * login
	         * authenticates a user
	         *
	         * @param  {Object}   user     - login info
	         * @param  {Function} callback - optional
	         * @return {Promise}
	         */
			login: function(user, callback) {
				var cb = callback || angular.noop;
				return Session.save({
					email: user.email,
					password: user.password
				}, function(user) {
					AppUser.set(user);
					growlNotifications.add('You have been logged in.', 'success', 4000);
					return cb(user);
				}, function(err) {
					return cb(err);
				}).$promise;
			},

			/**
			 * logout
	         * unauthenticates a user
	         *
	         * @param  {Function} callback - optional
	         * @return {Promise}
	         */
	        logout: function(callback) {
	          var cb = callback || angular.noop;

	          return Session.delete(function() {
	              AppUser.remove();
	              growlNotifications.add('You have been logged out.', 'success', 4000);
	              return cb();
	            },
	            function(err) {
	              return cb(err);
	            }).$promise;
	        },

	        /**
	         * createUser
	         * Create a new user
	         *
	         * @param  {Object}   user     - user info
	         * @param  {Function} callback - optional
	         * @return {Promise}
	         */
	        createUser: function(user, callback) {
	          var cb = callback || angular.noop;

	          return User.save(user,
	            function(user) {
	              AppUser.set(user);
	              Socket.emit('users:update');
	              return cb(user);
	            },
	            function(err) {
	              return cb(err);
	            }).$promise;
	        },

	        /**
	         * createTempUser
	         * Create a temp user
	         *
	         * @param  {Object}   user     - user info
	         * @param  {Function} callback - optional
	         * @return {Promise}
	         */
	        createTempUser: function(user, callback) {
	          var cb = callback || angular.noop;

	          return TempUser.save(user,
	            function(response) {
	            	Socket.emit('tempusers:update');
	              return cb(response);
	            },
	            function(err) {
	              return cb(err);
	            }).$promise;
	        },

	        /**
	         * createAdmin
	         * Create a new admin
	         *
	         * @param  {Object}   user     - user info
	         * @param  {Function} callback - optional
	         * @return {Promise}
	         */
	        createAdmin: function(user, callback) {
	          var cb = callback || angular.noop;
	          user.role = 'admin';
	          return User.save(user,
	            function(user) {
	            	Socket.emit('users:update');
	              return cb(user);
	            },
	            function(err) {
	              return cb(err);
	            }).$promise;
	        },

	        /**
	         * acceptUser
	         * Accept a temp user
	         *
	         * @param  {Number}   id     - user id
	         * @param  {Function} callback - optional
	         * @return {Promise}
	         */
	        acceptUser: function(id, callback) {
	          var cb = callback || angular.noop;
	          return TempUser.accept({id: id}, function(res) {
	          	growlNotifications.add('User has been accepted.', 'success', 4000);
	          	Socket.emit('users:update');
	            return cb(res);
	          },
	          function(err) {
	          	growlNotifications.add('There was an error accepting user.', 'danger', 4000);
	            return cb(err);
	          }).$promise;
	        },

	        /**
	         * acceptAdmin
	         * Accept a temp user as an admin
	         *
	         * @param  {Number}   id     - user id
	         * @param  {Function} callback - optional
	         * @return {Promise}
	         */
	        acceptAdmin: function(id, callback) {
	          var cb = callback || angular.noop;
	          return TempUser.acceptAdmin({id: id}, function(res) {
	          	growlNotifications.add('User has been accepted as an admin.', 'success', 4000);
	          	Socket.emit('users:update');
	            return cb(res);
	          },
	          function(err) {
	          	growlNotifications.add('There was an error accepting user as an admin.', 'danger', 4000);
	            return cb(err);
	          }).$promise;
	        },

	        /**
	         * declineUser
	         * Decline a temp user
	         *
	         * @param  {Number}   id     - user id
	         * @param  {Function} callback - optional
	         * @return {Promise}
	         */
	        declineUser: function(id, callback) {
	          var cb = callback || angular.noop;
	          return TempUser.decline({id: id}, function(res) {
	          	growlNotifications.add('User has been accepted as an admin.', 'success', 4000);
	          	Socket.emit('users:update');
	            return cb(res);
	          },
	          function(err) {
	          	growlNotifications.add('There was an error declining user.', 'danger', 4000);
	            return cb(err);
	          }).$promise;
	        },

	        /**
	         * removeUser
	         * Remove a user
	         *
	         * @param  {Number}   id     - user id
	         * @param  {Function} callback - optional
	         * @return {Promise}
	         */
	        removeUser: function(id, callback) {
	          var cb = callback || angular.noop;
	          return User.delete({id: id}, function(success) {
	          	growlNotifications.add('User has been removed.', 'success', 4000);
	          	Socket.emit('users:update');
	            return cb(success);
	          },
	          function(err) {
	          	growlNotifications.add('There was an error removing user.', 'danger', 4000);
	            return cb(err);
	          }).$promise;
	        },

	        forgotPassword: function(email, callback) {
	        	var cb = callback || angular.noop;
	        	return User.forgotPassword({email: email}, function(success) {
	        		growlNotifications.add('Your password reset link has been sent.', 'success', 4000);
	        		return cb(success);
	        	}, function(err) {
	        		return cb(err);
	        	}).$promise;
	        }
		};
	});