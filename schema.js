var graphql = require("graphql");
var fetch = require("node-fetch");

var githubRepoType = new graphql.GraphQLObjectType({
  name: "GithubRepo",
  fields: {
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
    fullName: {
      type: graphql.GraphQLString,
      resolve: function(repo) { return repo.full_name; }
    }
  }
});

var githubUserType = new graphql.GraphQLObjectType({
  name: "GithubUser",
  fields: {
    login: { type: graphql.GraphQLString },
    id: { type: graphql.GraphQLString },
    name: { type: graphql.GraphQLString },
    location: { type: graphql.GraphQLString },
    repos: {
      type: new graphql.GraphQLList(githubRepoType),
      resolve: function(user) {
        return fetch(user.repos_url)
          .then(function(res) {
            return res.json();
          })
          .then(function(json) {
            return json;
          });
      }
    },
  }
});

module.exports = new graphql.GraphQLSchema({
  query: new graphql.GraphQLObjectType({
    name: "Query",
    fields: {
      github: {
        type: githubUserType,
        args: {
          username: { type: graphql.GraphQLString }
        },
        resolve: function(_, args) {
          return fetch("https://api.github.com/users/" + args.username)
            .then(function(res) {
              return res.json();
            })
            .then(function(json) {
              return json;
            });
        }
      }
    }
  })
});
