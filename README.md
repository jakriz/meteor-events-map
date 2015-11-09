Real-time Events Map
====================
This is a simple [meteor](https://www.meteor.com/) application which displays a location extracted from an IP address to all connected clients in real time on the world map. This app can be used, for example, to show your users' activity around the world.

This app also shows how meteor can be used without a MongoDB collection when it's not needed. It uses a simple reactive variable to keep the track of the last event and lower level publish-subscribe API to send the data.

How to run
----------
1. Install [meteor](https://www.meteor.com/) and [npm](https://www.npmjs.com/)
2. Run command `meteor run --settings settings.json`
3. To show sample data on the map you can also run `ruby mock_events.rb` which generates and posts random IP addresses in random intervals

The app listens to new events at endpoint `events/` which is protected by HTTP Basic auth with credentials set in `settings.json` (by default set to username `admin` and password `admin`).

How to deploy
-------------
For easy production deployment you can use [docker](https://www.docker.com/) with the included `Dockerfile`. For more information read the [meteord documentation](https://github.com/meteorhacks/meteord).

Don't forget to specify the credentials for events endpoint, e.g.:

       docker run -d \
         -e ROOT_URL=http://yourapp.com \
         -e METEOR_SETTINGS='{"endpoint":{"username":"admin","password":"complicated_password"}}' \
         yourname/app
