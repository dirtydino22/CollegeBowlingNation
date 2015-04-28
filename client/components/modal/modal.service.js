/*@ngInject*/
function Modal($modal, socket) {
    'use strict';

    var openModal = function(ctrlString, templateUrl) {
        return $modal.open({
            templateUrl: templateUrl,
            windowClass: 'modal-default',
            controller: ctrlString
        });
    };

    var openResolvableModal = function(ctrlString, templateUrl, resolvable) {
        return $modal.open({
            templateUrl: templateUrl,
            windowClass: 'modal-default',
            controller: ctrlString,
            resolve: resolvable
        });
    };

    var openResolvableModalWithResult = function(ctrlString, templateUrl, resolvable, resultAction) {
        var modalInstance = $modal.open({
            templateUrl: templateUrl,
            windowClass: 'modal-default',
            controller: ctrlString,
            resolve: resolvable
        });
        modalInstance.result.then(function(result) {
            return resultAction(result);
        });
    };

    var openResolvableUpdateModalWithResult = function(ctrlString, templateUrl, resolvable, resultAction) {
        var modalInstance = $modal.open({
            templateUrl: templateUrl,
            windowClass: 'modal-default',
            controller: ctrlString,
            resolve: resolvable
        });
        modalInstance.result.then(function(result) {
            if (result === 'update') {
                return resultAction();
            }
        });
    };

    var openConfirmModal = function(ctrlString, templateUrl, resolvable, resultAction) {
        var modalInstance = $modal.open({
            templateUrl: templateUrl,
            windowClass: 'modal-default',
            controller: ctrlString,
            resolve: resolvable
        });
        modalInstance.result.then(function(result) {
            if (result === 'confirmed') {
                return resultAction();
            }
        });
    };

    var open = function(state, resultAction, obj) {
        var modals = {
            login: function() {
                return openModal('LoginCtrl as ctrl', 'components/modal/login/login.html');
            },
            signup: function() {
                return openModal('SignupCtrl as ctrl', 'components/modal/signup/signup.html');
            },
            createArticle: function() {
                return openResolvableModalWithResult('NewsCtrl as ctrl',
                    'components/modal/news/news.html', {
                        type: function() {
                            return 'create';
                        },
                        article: ['Auth', function(Auth) {
                            return {
                                author: Auth.getCurrentUser().name
                            };
                        }]
                    },
                    function() {
                        socket.socket.emit('news:update');
                    });
            },
            editArticle: function() {
                return openResolvableModal('NewsCtrl as ctrl',
                    'components/modal/news/news.html', {
                        type: function() {
                            return 'edit';
                        },
                        article: function() {
                            return resultAction;
                        }
                    });
            },
            confirmArticleRemoval: function() {
                return openConfirmModal('ConfirmCtrl as ctrl',
                    'components/modal/confirm/confirm.html', {
                        title: function() {
                            return 'Are you sure you want to delete this article?';
                        },
                        message: function() {
                            return 'This article will no longer be available.';
                        }
                    },
                    resultAction);
            },

            editPost: function() {
                return openResolvableModal('PostCtrl as ctrl',
                    'components/modal/post/post.html', {
                        type: function() {
                            return 'edit';
                        },
                        post: function() {
                            return resultAction;
                        }
                    });
            },
            createPost: function() {
                return openResolvableModal('PostCtrl as ctrl',
                    'components/modal/post/post.html', {
                        type: function() {
                            return 'create';
                        },
                        post: ['Auth', function(Auth) {
                            return {
                                author: Auth.getCurrentUser().name
                            };
                        }]
                    });
            },
            confirmPostRemoval: function() {
                return openConfirmModal('ConfirmCtrl as ctrl',
                    'components/modal/confirm/confirm.html', {
                        title: function() {
                            return 'Are you sure you want to delete this post?';
                        },
                        message: function() {
                            return 'This post will no longer be available.';
                        }
                    },
                    resultAction);
            },
            createBowler: function() {
                return openResolvableUpdateModalWithResult('BowlerCtrl as ctrl',
                    'components/modal/bowler/bowler.html', {
                        type: function() {
                            return 'create';
                        },
                        bowler: function() {
                            return {};
                        }
                    },
                    resultAction);
            },
            editBowler: function() {
                return openResolvableUpdateModalWithResult('BowlerCtrl as ctrl',
                    'components/modal/bowler/bowler.html', {
                        type: function() {
                            return 'edit';
                        },
                        bowler: function() {
                            return obj;
                        }
                    },
                    resultAction);
            },
            confirmBowlerRemoval: function() {
                return openConfirmModal('ConfirmCtrl as ctrl',
                    'components/modal/confirm/confirm.html', {
                        title: function() {
                            return 'Are you sure you want to delete this bowler?';
                        },
                        message: function() {
                            return 'This bowler will no longer be available.';
                        }
                    },
                    resultAction);
            },
            createNewSeason: function() {
                return openResolvableUpdateModalWithResult('NewSeasonCtrl as ctrl',
                    'components/modal/newseason/newseason.html', {
                        roster: function() {
                            return obj;
                        }
                    },
                    resultAction);
            },
            contact: function() {
                return openModal('ContactCtrl as ctrl','components/modal/contact/contact.html');
            },
            teamRankings: function() {
                return openResolvableModal('TeamRankingsCtrl as ctrl',
                    'components/modal/team-rankings/team-rankings.html', {
                        team: function() {
                            return {
                              university: resultAction.university,
                              teamStats: resultAction.teamStats
                            };
                        },
                        tabs: function() {
                            return [
                                {title: 'Team Stats', template: 'components/modal/team-rankings/tabs/team.html'},
							    {title: 'Bowler Stats', template: 'components/modal/team-rankings/tabs/bowler.html'}
                            ];
                        },
                        bowlers: function() {
                          return resultAction.roster;
                        }
                    });
            },
            appCache: function() {
                return openConfirmModal('ConfirmCtrl as ctrl',
                    'components/modal/confirm/confirm.html', {
                        title: function() {
                            return 'A new version of this site is available.';
                        },
                        message: function() {
                            return 'Would you like to load it?';
                        }
                    },
                    resultAction);
            }
        };

        return modals[state]();
    };

    return {
        open: open
    };
}

Modal.$inject = ['$modal', 'socket'];

angular.module('app')
    .factory('Modal', Modal);
