import datetime
import os
import json
import logging
import webapp2
from google.appengine.ext import ndb

class Server(ndb.Model):
    """A model for representing a game server"""
    title = ndb.StringProperty(indexed=True)
    url = ndb.StringProperty(indexed=True)

class ServerListHandler(webapp2.RequestHandler):
    """List servers"""
    def get(self):
        serverList = None

        allQuery = Server.query()

        for server in allQuery.iter():
            if serverList == None:
                serverList = []

            serverList.append(server)

        if serverList == None:
            self.abort(500)
        else:
            self.response.set_status(200)
            self.response.content_type = 'application/json'
            self.response.out.write(json.dumps([server.to_dict() for server in serverList]))

app = webapp2.WSGIApplication([
    (r'/api/servers', ServerListHandler)
], debug=True)

def handle_404(request, response, exception):
    """Default handler for 404 status code"""
    logging.exception(exception)

    response.set_status(404)


def handle_500(request, response, exception):
    """Default handler for 500 status code"""
    logging.exception(exception)

    response.set_status(500)


app.error_handlers[404] = handle_404
app.error_handlers[500] = handle_500
