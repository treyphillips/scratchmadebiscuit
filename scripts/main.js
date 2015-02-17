(function() {
  window.App = window.App || {};

  var myApp = Backbone.Model.extend({
    defaults: {
      username: 'treyphillips'
    }
  });

  var Chirp = Backbone.Model.Extend({
    idAttribute: '_id',
    
    defaults: function(attributes) {
      attributes = attributes || {};
      return _.defaults(attributes, {
        body: '',
        username: '<no user>',
        timestamp: (new Date()).toString()
      });
    }
  });

  var ChirpsCollection = Backbone.Collection.extend({
    url: 'http://tiny-pizza-server.herokuapp.com/collections/chirps',
    model: Chirp,

    comparator: 'timestamp'
  });

  var ChirpInputView = Backbone.View.extend({
    el: ".js-chirp-input",

    events: {
      'submit': 'createChirp'
    },

    createChirp: function(e) {
      e.preventDefault();
      var body = this.$('.js-new-chirp').val();
      var username = myApp.get('username');
      this.collection.create({
        body: body,
        username: username
      });
      this.$('.js-new-chirp').val('');
    }
  });

  var ChirpItemView = Backbone.View.extend({
    tagName: 'li',
    className: 'chirp',
    template: _.template($('#chirp-template').text()),

    events: {
      'click .js-destroy': 'destroyChirp'
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
    },

    destroyToot: function() {
      this.model.destroy();
    }
  });

  var ChirpsListView = Backbone.View.extend({
    el: '.js-chirps',

    initialize: function() {
      this.listenTo(this.collection, 'destroy sync', this.render);
    },

    render: function() {
      var self = this;

      this.$el.empty();

      this.collection.each(function(chirp) {
        var itemView = new ChirpItemView({
          model: chirp
        });
        itemView.render();
        seld.$el.append(itemView.el);
      });

      return this;
    }
  });

  $(document).ready(function() {
    App.model = new myApp();
    var chirps = new ChirpsCollection();
    var chirpList = new ChirpsListView({
      collection: chirps
    });
    var chirpInput = new ChirpInputView({
      collection: chirps
    });
    chirps.fetch();
  });


})();
