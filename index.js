var graphqlHTTP = require("express-graphql");
var express = require("express");

var schema = require("./schema");

var app = express();

app.use("/graphql", graphqlHTTP({
  schema: schema,
  pretty: true,
  graphiql: true
}));

app.listen(process.env.PORT || 3000);
