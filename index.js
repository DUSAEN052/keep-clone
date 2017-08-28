'use strict';

const Note = require('./models/note.js');
const Hapi = require('hapi');

const server = new Hapi.Server();
const notes = new Map();
let counter = 0;

server.connection({ port: 3000, host: 'localhost' });

server.route({
  method: 'GET',
  path: '/notes',
  handler: function (request, reply) {
    const notesArr = [];

    for (let key of notes.keys()) {
      notesArr.push(notes.get(key))
    }

    reply(notesArr);
  }
});

server.route({
  method: 'POST',
  path: '/note',
  handler: function (request, reply) {
    let note = new Note(request.payload.title, request.payload.body, counter);
    notes.set(counter, note);
    counter++;
    reply(note);
  }
});

server.route({
  method: 'GET',
  path: '/note/{id}',
  handler: function (request, reply) {
    reply(notes.get(parseInt(request.params.id)));
  }
});

server.route({
  method: 'DELETE',
  path: '/note/{id}',
  handler: function(request, reply) {
    notes.delete(parseInt(request.params.id));
    reply().code(204);
  }
})

server.start((err) => {
    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});
