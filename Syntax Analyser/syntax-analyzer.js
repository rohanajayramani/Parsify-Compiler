function analyzeCode() {
  const codeInput = document.getElementById("code-input").value;
  const errors = analyzeSyntax(codeInput);
  const errorOutput = document.getElementById("error-output");

  if (errors.length === 0) {
    errorOutput.textContent = "No syntax errors found.";
  } else {
    errorOutput.textContent = "Syntax errors found:\n" + errors.join("\n");
  }
}

function analyzeSyntax(code) {
  const errors = [];
  // Perform syntax analysis logic here

  // Example: Check for missing semicolons
  const lines = code.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (
      line &&
      !line.endsWith(";") &&
      !(line.endsWith("{") || line.endsWith("}")) &&
      !line.startsWith("#")
    ) {
      errors.push(`Missing semicolon at line ${i + 1}`);
    }
  }

  // Example: Check for missing braces
  let braceCount = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    for (let j = 0; j < line.length; j++) {
      if (line[j] === "{") {
        braceCount++;
      } else if (line[j] === "}") {
        braceCount--;
      }
    }
  }

  if (braceCount > 0) {
    errors.push(`Missing closing brace(s)`);
  } else if (braceCount < 0) {
    errors.push(`Missing opening brace(s)`);
  }

  // Example: Check for unmatched parentheses, brackets, or angles
  const stack = [];
  const openingSymbols = ["(", "["];
  const closingSymbols = [")", "]"];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    for (let j = 0; j < line.length; j++) {
      const symbol = line[j];
      if (openingSymbols.includes(symbol)) {
        stack.push(symbol);
      } else if (closingSymbols.includes(symbol)) {
        const expectedOpeningSymbol =
          openingSymbols[closingSymbols.indexOf(symbol)];
        if (
          stack.length === 0 ||
          stack[stack.length - 1] !== expectedOpeningSymbol
        ) {
          errors.push(`Unmatched ${symbol} at line ${i + 1}`);
        } else {
          stack.pop();
        }
      }
    }
  }

  if (stack.length > 0) {
    const unmatchedSymbols = stack.join(", ");
    errors.push(`Unmatched ${unmatchedSymbols}`);
  }

  // Example: Check for strings presented without quotes
  const stringRegex = /(?<==\s*)([^;]+)/g;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    console.log(line);
    const matches = line.match(stringRegex);
    console.log(matches);
    if (matches && line.startsWith("string")) {
      for (const str of matches) {
        if (
          !str.startsWith('"') ||
          !str.startsWith('"') ||
          !str.endsWith('"')
        ) {
          errors.push(
            `String '${str}' presented without quotes at line ${i + 1}`
          );
        }
      }
    }
  }

  //   // Example: Check for errors in function declarations
  //   const functionRegex = /(\w+)\s+(\w+)\s*\([^)]*\)\s*{/;
  //   for (let i = 0; i < lines.length; i++) {
  //     const line = lines[i].trim();
  //     const matches = line.match(functionRegex);
  //     if (matches && matches.length >= 3) {
  //       const returnType = matches[1];
  //       const functionName = matches[2];
  //       if (!isValidDataType(returnType)) {
  //         errors.push(
  //           `Invalid return type '${returnType}' in function '${functionName}' at line ${
  //             i + 1
  //           }`
  //         );
  //       }
  //     }
  //   }

  //   function isValidDataType(dataType) {
  //     // Implement your own validation logic for data types
  //     // Return true if the data type is valid, false otherwise
  //   }

  // Example: Check for variable redeclaration
  const variables = new Set();
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (
      line.startsWith("int") ||
      line.startsWith("float") ||
      line.startsWith("double")
    ) {
      const variableDeclaration = line.split("=")[0].trim();
      const variableName = variableDeclaration.split(" ")[1].trim();
      if (variables.has(variableName)) {
        errors.push(`Variable '${variableName}' redeclared at line ${i + 1}`);
      } else {
        variables.add(variableName);
      }
    }
  }

  return errors;
}
