if (Meteor.isClient) {
  Events = new Meteor.Collection("events");
  Meteor.subscribe("events");

  markers = {};

  Meteor.startup(function() {
    GoogleMaps.load();
  });

  Template.map.helpers({
    mapOptions: function() {
      if (GoogleMaps.loaded()) {
        return {
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          center: new google.maps.LatLng(0, 0),
          zoom: 2,
          mapTypeControl: false,
          panControl: false,
          rotateControl: false,
          streetViewControl: false
        };
      }
    }
  });

  Template.map.onCreated(function() {
    GoogleMaps.ready("map", function(map) {
      Events.find().observe({
        added: function(event) {
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(event.latitude, event.longitude),
            map: map.instance
          });
          removeMarkerAfter(marker, 3000);
        }
      });
    });
  });

  function removeMarkerAfter(marker, timeout) {
    Meteor.setTimeout(function() {
      marker.setMap(null)
    }, timeout);
  }
}

if (Meteor.isServer) {
  var reader;
  var lastEvent = new ReactiveVar();

  Meteor.startup(function() {
    reader = Meteor.npmRequire('maxmind-db-reader').openSync(process.env.PWD + '/private/GeoLite2-City.mmdb');
  });

  Meteor.publish("events", function() {
    var self = this;
    Tracker.autorun(function() {
      self.added("events", Random.id(), lastEvent.get());
    });
    return self.ready();
  });

  Router.route("/events", {where: "server"}).post(function() {
    ipAddress = this.request.body.ipAddress;

    reader.getGeoData(ipAddress, function(error, result) {
      if (!error) {
        lastEvent.set({
          latitude: result.location.latitude,
          longitude: result.location.longitude
        });
      }
    });

    this.response.end("ok");
  });

  var basicAuth = new HttpBasicAuth("admin", "admin");
  basicAuth.protect(["/events"]);
}
