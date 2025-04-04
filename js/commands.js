const commands = [
  { name: "ls", description: "List directory contents" },
  { name: "cd", description: "Change the current directory" },
  { name: "cat", description: "Display file contents" },
  { name: "clear", description: "Clear the terminal screen" },
  { name: "cityfetch", description: "Display system information" },
  { name: "help", description: "Display available commands" },
  { name: "pwd", description: "Print working directory" },
  { name: "theme", description: "Change terminal theme (dark/light/amber/americanfootball)" },
  { name: "echo", description: "Display a line of text" },
  { name: "date", description: "Display the current date and time" }
];

function generateHelpText() {
  let output = "Available commands:\n\n";
  commands.forEach(cmd => {
    output += `${cmd.name.padEnd(12)} - ${cmd.description}\n`;
  });
  return output;
}

function changeDirectory(dir) {
  if (!dir) {
    return "bash: cd: missing operand";
  }
  
  if (dir === "..") {
    if (currentDir === "~") {
      return `bash: cd: ..: No such directory`;
    } else {
      currentDir = "~";
      updatePrompt();
      return "";
    }
  } 
  else if (dir === "~") {
    currentDir = "~";
    updatePrompt();
    return "";
  } 
  else {
    if (fileSystem[currentDir]?.children.includes(dir)) {
      if (fileSystem[dir]?.type === "directory") {
        currentDir = dir;
        updatePrompt();
        return "";
      } else {
        return `bash: cd: ${dir}: Not a directory`;
      }
    } else {
      return `bash: cd: ${dir}: No such directory`;
    }
  }
}

function catFile(file) {
  if (!file) {
    return "bash: cat: missing operand";
  }
  
  if (fileSystem[currentDir]?.children.includes(file)) {
    if (fileContents[file]) {
      return fileContents[file];
    } else {
      return `bash: cat: ${file}: No such file`;
    }
  } else {
    return `bash: cat: ${file}: No such file or directory`;
  }
}

function generateCityFetch() {
  return `
__/\\\\________/\\\\_            voyager@neocities
 _\\/\\\\_______\\/\\\\_           -----------
  _\\//\\\\______/\\\\__          OS: HTML
   __\\//\\\\____/\\\\___         Host: neocities.org
    ___\\//\\\\__/\\\\____        Kernel: psuedo-linux
     ____\\//\\\\/\\\\_____       Uptime: Since ${new Date().toISOString().split('T')[0]}
      _____\\//\\\\\\\\______      Shell: Psuedo-Bash
       ______\\//\\\\_______     Theme: ${themes[currentThemeIndex].replace('-theme', '')}
        _______\\///________
`;
}

const formatListing = (items) => {
  if (!items || items.length === 0) return "";
  
  const output = [];
  items.forEach(item => {
    const isDirectory = fileSystem[item]?.type === "directory" || 
                       (currentDir !== "~" && fileSystem[`${currentDir}/${item}`]?.type === "directory");
    
    const formattedItem = item.includes(" ") ? `"${item}"` : item;
    
    if (isDirectory) {
      output.push(`<span class="directory">${formattedItem}/</span>`);
    } else {
      output.push(`<span class="file">${formattedItem}</span>`);
    }
  });
  
  return output.join("  ");
};

const listFiles = () => {
  const dirContents = fileSystem[currentDir]?.children || [];
  if (dirContents.length > 0) {
    return formatListing(dirContents);
  } else {
    return `ls: cannot open directory '${currentDir}': No such directory`;
  }
};

function executeCommand(command) {
  if (!command) {
    return "";
  }

  const args = command.split(" ");
  const cmd = args[0];

  let processedArgs = [];
  let currentArg = "";
  let inQuotes = false;
  let quoteChar = "";

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    
    if (!inQuotes && (arg.startsWith('"') || arg.startsWith("'"))) {
      inQuotes = true;
      quoteChar = arg[0];
      currentArg = arg.substring(1);
      
      if (arg.endsWith(quoteChar) && arg.length > 1) {
        inQuotes = false;
        currentArg = currentArg.substring(0, currentArg.length - 1);
        processedArgs.push(currentArg);
        currentArg = "";
      }
    } 
    else if (inQuotes && arg.endsWith(quoteChar)) {
      currentArg += " " + arg.substring(0, arg.length - 1);
      inQuotes = false;
      processedArgs.push(currentArg);
      currentArg = "";
    }
    else if (inQuotes) {
      currentArg += " " + arg;
    }
    else {
      processedArgs.push(arg);
    }
  }

  if (currentArg) {
    processedArgs.push(currentArg);
  }

  switch (cmd) {
    case "help":
      return generateHelpText();
    
    case "cd":
      return changeDirectory(processedArgs[0]);
    
    case "cat":
      return catFile(processedArgs[0]);
    
    case "ls":
      const flags = processedArgs.filter(arg => arg.startsWith("-"));
      return listFiles(flags);
    
    case "clear":
      terminalOutput.innerHTML = "";
      return "";
    
    case "cityfetch":
      return generateCityFetch();
    
    case "pwd":
      return currentDir;
    
    case "theme":
      return changeTheme(processedArgs[0]);
    
    case "echo":
      return processedArgs.join(" ");
    
    case "date":
      return new Date().toString();
    
    default:
      return `bash: ${cmd}: command not found`;
  }
}
