# Overview

Chat with Code is an official ChatGPT plugin that let's you interact with everything in GitHub. Everything, including repos, issues, commits, file contents, and more. 

# How it works

Chat with Code essentially is a "meta plugin" where the API endpoints are completely fluid, and it depends on ChatGPT to decide which functions to call from the [Octokit library](https://octokit.github.io/rest.js/v19). 

An example flow:

- The plugin hits an endpoint `/api/repo` (poorly named, should be changed to something more generic).
- Depending on what the users request is in chat, ChatGPT decides which function should be called, and what attributes should be included.
```text
Example chat:

User: describe aavetis/github-chatgpt-plugin

ChatGPT:
- use repos.get function
- relevant attributes: {
  owner: "aavetis",
  repo: "github-chatgpt-plugin"
  }
```
- The plugin endpoint then responds with the raw data from GitHub API according to that function call.
- ChatGPT uses the raw data to construct its response to user.


# Finding the plugin
![image](https://github.com/aavetis/github-chatgpt-plugin/assets/3076502/b89baba7-bcdb-4f9e-af47-960943af674c)

**Note:** Installing the plugin will direct you to an optional OAuth page to login with GitHub. Authenticating allows you to interact with private repos, but is completely optional.

# Well-known
See [public/.well-known](/public/.well-known) for plugin instructions and API spec.
