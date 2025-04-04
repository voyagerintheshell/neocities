const terminalOutput = document.getElementById("terminal-output");
const userInput = document.getElementById("user-input");
const promptSpan = document.getElementById("prompt");
const themeToggle = document.getElementById("theme-toggle");
const completionSuggestions = document.getElementById("completion-suggestions");

let currentDir = "~";
const commandHistory = [];
let historyIndex = -1;
let lastCommand = "";

const welcomeMessage = `Welcome to Voyager's Black Box Terminal! Type 'help' for available commands.`;

function updatePrompt() {
  promptSpan.textContent = `[voyager@neocities]`;
}

function focusInput() {
  userInput.focus();
}

function showCompletionSuggestions(suggestions) {
  if (suggestions.length === 0) {
    completionSuggestions.style.display = "none";
    return;
  }
  
  completionSuggestions.innerHTML = "";
  suggestions.forEach(suggestion => {
    const div = document.createElement("div");
    div.className = "suggestion";
    div.textContent = suggestion;
    div.onclick = (e) => {
      e.stopPropagation();
      userInput.value = suggestion;
      completionSuggestions.style.display = "none";
      focusInput();
    };
    completionSuggestions.appendChild(div);
  });
  
  completionSuggestions.style.display = "block";
}

function handleTabCompletion() {
  const input = userInput.value.trim();
  let suggestions = [];
  
  if (!input.includes(" ")) {
    suggestions = commands
      .map(cmd => cmd.name)
      .filter(cmd => cmd.startsWith(input));
    
    if (suggestions.length === 1) {
      userInput.value = suggestions[0] + " ";
      completionSuggestions.style.display = "none";
    } else if (suggestions.length > 1 && input) {
      showCompletionSuggestions(suggestions);
    }
  } 
  else if (input.startsWith("cat ") || input.startsWith("cd ")) {
    const cmd = input.split(" ")[0];
    const partial = input.split(" ")[1] || "";
    
    let matchingItems = [];
    if (cmd === "cat") {
      matchingItems = fileSystem[currentDir]?.children.filter(item => 
        item.startsWith(partial) && fileContents[item]
      ) || [];
    } else if (cmd === "cd") {
      if (partial === ".." || partial === "~") {
        matchingItems = [partial];
      } else {
        matchingItems = fileSystem[currentDir]?.children.filter(item => 
          item.startsWith(partial) && (fileSystem[item]?.type === "directory" || 
          fileSystem[`${currentDir}/${item}`]?.type === "directory")
        ) || [];
        
        if ("..".startsWith(partial)) {
          matchingItems.push("..");
        }
        
        if ("~".startsWith(partial)) {
          matchingItems.push("~");
        }
      }
    }
    
    if (matchingItems.length === 1) {
      const item = matchingItems[0];
      userInput.value = `${cmd} ${item.includes(" ") ? `"${item}"` : item}`;
      completionSuggestions.style.display = "none";
    } else if (matchingItems.length > 1 && partial) {
      showCompletionSuggestions(matchingItems.map(item => `${cmd} ${item.includes(" ") ? `"${item}"` : item}`));
    }
  }
}

function appendToTerminal(html, isHtml = false) {
  const div = document.createElement('div');
  div.className = 'no-margin';
  
  if (isHtml) {
    div.innerHTML = html;
  } else {
    div.textContent = html;
  }
  
  terminalOutput.appendChild(div);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function handleUserInput() {
  const userCommand = userInput.value.trim();
  
  appendToTerminal(`${promptSpan.textContent} ${userInput.value}`);
  
  if (userCommand) {
    if (userCommand !== lastCommand) {
      commandHistory.push(userCommand);
      lastCommand = userCommand;
    }
    
    historyIndex = commandHistory.length;

    const output = executeCommand(userCommand);
    if (output) {
      if (output.includes('<a') || output.includes('<span')) {
        appendToTerminal(`${output}`, true);
      } else {
        appendToTerminal(`${output}`);
      }
    }
  }
  
  userInput.value = "";
  updatePrompt();
  completionSuggestions.style.display = "none";
}

function initTerminal() {
  document.body.className = themes[currentThemeIndex];
  updatePrompt();
  appendToTerminal(welcomeMessage);
  userInput.focus();
}

userInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    handleUserInput();
    event.preventDefault();
  } else if (event.key === "ArrowUp") {
    if (historyIndex > 0) {
      historyIndex--;
      userInput.value = commandHistory[historyIndex];
      setTimeout(() => {
        userInput.selectionStart = userInput.selectionEnd = userInput.value.length;
      }, 0);
    }
    event.preventDefault();
  } else if (event.key === "ArrowDown") {
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      userInput.value = commandHistory[historyIndex];
    } else {
      historyIndex = commandHistory.length;
      userInput.value = "";
    }
    setTimeout(() => {
      userInput.selectionStart = userInput.selectionEnd = userInput.value.length;
    }, 0);
    event.preventDefault();
  } else if (event.key === "Tab") {
    handleTabCompletion();
    event.preventDefault();
  } else if (event.key === "Escape") {
    completionSuggestions.style.display = "none";
  } else if (event.key === "c" && event.ctrlKey) {
    appendToTerminal(`^C`);
    userInput.value = "";
    event.preventDefault();
  }
});

userInput.addEventListener("input", function() {
  completionSuggestions.style.display = "none";
});

document.addEventListener("click", function(event) {
  if (event.target !== userInput && !event.target.classList.contains("suggestion")) {
    completionSuggestions.style.display = "none";
    focusInput();
  }
});

themeToggle.addEventListener("click", function(event) {
  event.stopPropagation();
  executeCommand("theme");
});

initTerminal();
