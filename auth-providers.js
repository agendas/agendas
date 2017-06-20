angular.module("agendasApp")
  .value("$authProviders", [
    {
      name: "Google",
      color: "red",
      provider: new firebase.auth.GoogleAuthProvider(),
      loginHandler: (provider, event) => {
        return firebase.auth().signInWithPopup(provider);
      }
    },
    {
      name: "Github",
      color: "blue-grey",
      provider: new firebase.auth.GithubAuthProvider(),
      loginHandler: (provider, event) => {
        return firebase.auth().signInWithPopup(provider);
      }
    }
  ])
