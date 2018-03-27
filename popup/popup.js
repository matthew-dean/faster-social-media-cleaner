(function() {

  let defaultAppState = {
    user: {},
    tabId: null,
    from: '2005-01-01',
    to: '2005-12-31',
    agree: false,
    started: false,
    deleting: false,
    results: 0,
    progress: 0,
    error: false
  };

  let appState = localStorage.getItem('appState');

  if (appState) {
    appState = JSON.parse(appState);
  }
  else {
    appState = JSON.parse(JSON.stringify(defaultAppState));
    localStorage.setItem('appState', JSON.stringify(appState));
  }

  var App = new Vue({
    render: render,
    data: appState,
    computed: {
      stringified: function() {
        return JSON.stringify(this.$data);
      }
    },
    methods: {
      cancelAction: function() {
        this.deleting = false;
        this.started = false;
        this.results = 0;
        this.progress = 0;
        
        if (this.tabId) {
          chrome.tabs.remove(this.tabId);
        }
      },
      deleteAction: function() {
        if (!this.user.id) {
          return this.error = true;
        }
        else {
          this.error = false;
        }
        createActivityLogTab(function(tab) {
          App.$data.tabId = tab.id;
        });
      }
    },
    watch: {
      stringified: function() {
        localStorage.setItem('appState', this.stringified);
      }
    }
  }).$mount('#app');

  function startDeletion() {
    /* Begin */
    App.$data.started = true;
    chrome.tabs.sendMessage(App.$data.tabId, {
      find: {
        from: App.$data.from,
        to: App.$data.to
      }
    });
  }

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      
      if (request.user) {
        App.$data.user = request.user;
        return true;
      }

      if (request.ready) {
        startDeletion();
      }

      if (request.loaderCount) {
        App.$data.results = request.loaderCount;
      }

      if (request.items) {
        App.$data.results = request.items;  
        App.$data.progress = Math.round(((request.items - request.remaining) / request.items) * 100);
        App.$data.deleting = true;
      }

      if (request.finished) {
        App.cancelAction();
      }
    }
  );

  function getUser() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        user: true
      }, function(response) {
        if (response && response.user) {
          App.$data.user = response.user;
        }
      });
    });
  }

  getUser();

  function createActivityLogTab(cb) {
    let timeStart = new Date(App.$data.from).getTime() / 1000;
    let timeEnd = new Date(App.$data.to).getTime() / 1000;

    chrome.tabs.create({
      url: 'https://m.facebook.com/' + App.$data.user.id + '/allactivity?timeend=' + timeEnd + '&timestart=' + timeStart,
      active: false
    }, cb);
  }


  /* generated from popup.vue at https://vuejs-tips.github.io/compiler/ */
  function render() {
    with(this) {
        return _c('section', [_c('p', [_v(
            "Select a range to delete/hide posts from your Facebook history."
        )]), _c('p', {
            staticClass: "has-text-danger"
        }, [_v(
            "Warning: Deletions are permanent! Make a backup of your data first!"
        )]), _c('div', {
            staticClass: "box container is-fluid"
        }, [_c('div', {
            staticClass: "field"
        }, [_c('label', {
            attrs: {
                "for": "from"
            }
        }, [_v("From")]), _c('div', {
            staticClass: "control"
        }, [_c('input', {
            directives: [{
                name: "model",
                rawName: "v-model",
                value: (
                    from
                ),
                expression: "from"
            }],
            staticClass: "datepicker",
            attrs: {
                "type": "date",
                "id": "from"
            },
            domProps: {
                "value": (from)
            },
            on: {
                "input": function(
                    $event) {
                    if ($event.target
                        .composing
                    ) return;
                    from =
                        $event.target
                        .value
                }
            }
        })])]), _c('div', {
            staticClass: "field"
        }, [_c('label', {
            attrs: {
                "for": "to"
            }
        }, [_v("To")]), _c('div', {
            staticClass: "control"
        }, [_c('input', {
            directives: [{
                name: "model",
                rawName: "v-model",
                value: (to),
                expression: "to"
            }],
            staticClass: "datepicker",
            attrs: {
                "type": "date",
                "id": "to"
            },
            domProps: {
                "value": (to)
            },
            on: {
                "input": function(
                    $event) {
                    if ($event.target
                        .composing
                    ) return;
                    to = $event
                        .target
                        .value
                }
            }
        })])]), _c('div', {
            attrs: {
                "id": "clean"
            }
        }, [_c('p', {
            staticClass: "is-size-7 has-text-grey"
        }, [_v(
            "Not all activity can be deleted. In those cases, this action will hide the activity from your Timeline."
        )]), (started) ? _c('div', {
            attrs: {
                "id": "progress"
            }
        }, [_c('p', {
            staticClass: "is-size-6",
            attrs: {
                "id": "progressMessage"
            }
        }, [_v(_s(deleting ?
                'Deleting...' :
                'Loading...') +
            _s(results))]), _c(
            'progress', {
                staticClass: "progress is-primary is-small",
                attrs: {
                    "id": "progressBar",
                    "max": "100"
                },
                domProps: {
                    "value": progress
                }
            }), _c('a', {
            staticClass: "button is-primary",
            on: {
                "click": cancelAction
            }
        }, [_v("Cancel")])]) : _c('div', {
            attrs: {
                "id": "commit"
            }
        }, [_c('div', {
            staticClass: "field"
        }, [_c('label', {
            staticClass: "checkbox"
        }, [_c('input', {
            directives: [{
                name: "model",
                rawName: "v-model",
                value:
                    (
                        agree
                    ),
                expression: "agree"
            }],
            attrs: {
                "type": "checkbox",
                "id": "agree"
            },
            domProps: {
                "checked": Array
                    .isArray(
                        agree
                    ) ?
                    _i(
                        agree,
                        null
                    ) >
                    -
                    1 :
                    (
                        agree
                    )
            },
            on: {
                "change": function(
                    $event
                ) {
                    var
                        $$a =
                        agree,
                        $$el =
                        $event
                        .target,
                        $$c =
                        $$el
                        .checked ?
                        (
                            true
                        ) :
                        (
                            false
                        );
                    if (
                        Array
                        .isArray(
                            $$a
                        )
                    ) {
                        var
                            $$v =
                            null,
                            $$i =
                            _i(
                                $$a,
                                $$v
                            );
                        if (
                            $$el
                            .checked
                        ) {
                            $$i
                                <
                                0 &&
                                (
                                    agree =
                                    $$a
                                    .concat(
                                        [
                                            $$v
                                        ]
                                    )
                                )
                        } else {
                            $$i
                                >
                                -
                                1 &&
                                (
                                    agree =
                                    $$a
                                    .slice(
                                        0,
                                        $$i
                                    )
                                    .concat(
                                        $$a
                                        .slice(
                                            $$i +
                                            1
                                        )
                                    )
                                )
                        }
                    } else {
                        agree
                            =
                            $$c
                    }
                }
            }
        }), _v(
            "Yes, I know what I'm doing."
        )])]), _c('a', {
            staticClass: "button is-danger",
            attrs: {
                "disabled": !agree
            },
            on: {
                "click": deleteAction
            }
        }, [_v("Delete")])]), (error) ? _c('p', {
            staticClass: "is-size-7 has-text-danger",
            attrs: {
                "id": "error"
            }
        }, [_v(
            "There was an error. Try refreshing your Facebook page."
        )]) : _e()])])])
    }
}


})();