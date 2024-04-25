const vm = require('vm');
const fs = require('fs');
const http = require('http');

// List of disallowed modules
const disallowedModules = ['http', 'fs'];

// Custom require function that filters out disallowed modules
const customRequire = (moduleName) => {
    console.error(`require is not allowed.`);
    return;
    // if (disallowedModules.includes(moduleName)) {
    //     console.error(`Module '${moduleName}' is not allowed.`);
    //     return;
    // }
    // return require(moduleName);
};

// Create a sandboxed context with the custom require function
const sandbox = {
    require: customRequire,
    console,
    // setTimeout,
    // setInterval,
    // clearInterval
};

try {
    // Read the user's code from a file or some other source
    const userCode = fs.readFileSync(process.argv[2], 'utf8');

    // Execute the user's code in the sandboxed environment
    vm.createContext(sandbox);
    vm.runInContext(userCode, sandbox);
} catch (error) {
    // Handle the error without including the stack trace
    console.error(`Error: ${error.message}`);
}
