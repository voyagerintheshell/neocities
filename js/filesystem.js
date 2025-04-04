const fileSystem = {
  "~": {
    type: "directory",
    children: ["about me", "misc"],
  },
  "about me": {
    type: "directory",
    children: ["general", "interests", "music i like", "socials"],
  },
  "misc": {
    type: "directory",
    children: ["source code", "quote of whenever i feel like it"],
  }
};

const fileContents = {
  "general": `                                          _       __  __              __         ____
 _   ______  __  ______ _____ ____  _____(_)___  / /_/ /_  ___  _____/ /_  ___  / / /
| | / / __ \\/ / / / __ \`/ __ \`/ _ \\/ ___/ / __ \\/ __/ __ \\/ _ \\/ ___/ __ \\/ _ \\/ / /
| |/ / /_/ / /_/ / /_/ / /_/ /  __/ /  / / / / / /_/ / / /  __(__  ) / / /  __/ / /
|___/\\____/\\__, /\\__,_/\\__, /\\___/_/  /_/_/ /_/\\__/_/ /_/\\___/____/_/ /_/\\___/_/_/
          /____/      /____/`,
  "interests": `i like racing, aviation, linux, programming, cyberpunk (the genre and the game but this is referring to the genre), that sort of stuff`,
  "music i like": `slowcore, shoegaze and stuff. i adore clay partons work at duster, eiafuawn, calm etc. you should listen to tacoma radar`,
  "socials": `placeholder`,
  "quote of whenever i feel like it": `"What's reality? I don't know. When my bird was looking at my computer monitor I thought 'That bird has no idea what he's looking at.' And yet what does the bird do? Does he panic? No, he can't really panic, he just does the best he can. Is he able to live in a world where he's so ignorant? Well, he doesn't really have a choice. The bird is okay even though he doesn't understand the world. You're that bird looking at the monitor, and you're thinking to yourself, I can figure this out. Maybe you have some bird ideas. Maybe that's the best you can do."
- Terry Davis`,
  "source code": `<a href="https://github.com/voyagerintheshell/neocities/" target="_blank" class="terminal-link">my github repo (click!!!)</a>`
};
