angular.module("agendasApp")
  .value("$authProviders", new Map([
    ["google.com", {
      id: "google.com",
      name: "Google",
      color: "red",
      provider: new firebase.auth.GoogleAuthProvider(),
      loginHandler: (provider, event) => {
        return firebase.auth().signInWithRedirect(provider);
      }
    }],
    ["github.com", {
      name: "Github",
      color: "blue-grey",
      provider: new firebase.auth.GithubAuthProvider(),
      loginHandler: (provider, event) => {
        return firebase.auth().signInWithRedirect(provider);
      }
    }]
  ]))
