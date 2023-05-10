const grammar = {
  Program: [["Declaration*"]],

  Declaration: [["Type", "Declarator", '";"']],

  Type: [
    ["int"],
    ["float"],
    ["double"],
    ["char"],
    ["void"],
    // Add more types as needed
  ],

  Declarator: [
    ["Identifier"],
    ["Identifier", "ArraySpecifier"],
    // Add more declarator rules as needed
  ],

  ArraySpecifier: [
    ['"["', "Expression", '"]"'],
    // Add more array specifier rules as needed
  ],

  Expression: [
    // Define rules for expressions
    // This can include arithmetic expressions, logical expressions, function calls, etc.
  ],

  // Add more grammar rules for statements, control structures, functions, etc.

  Identifier: [["[a-zA-Z_][a-zA-Z0-9_]*"]],
};
