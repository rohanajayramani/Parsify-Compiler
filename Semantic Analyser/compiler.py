import os
import sys
import time
import argparse
import platform
import subprocess as sp 
import webbrowser
import codecs

script_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(script_dir, "modules"))

from cparser import Parser
from scanner import Scanner, SymbolTableManager
from semantic_analyser import SemanticAnalyser
from code_gen import CodeGen, MemoryManager


# Maximal virtual memory for compiled program process (in bytes).
MAX_VIRTUAL_MEMORY = 50 * 1024 * 1024 # 50 MB

def limit_virtual_memory():
    import resource
    resource.setrlimit(resource.RLIMIT_AS, (MAX_VIRTUAL_MEMORY, MAX_VIRTUAL_MEMORY))


def compile(args):
    print("Compiling", args.source_file)
    SymbolTableManager.init()
    MemoryManager.init()
    parser = Parser(args.source_file)
    start = time.time()
    parser.parse()
    stop = time.time() - start
    print(f"Compilation took {stop:.6f} s")
    if not SymbolTableManager.error_flag:
        print("Compilation successful!")
    else:
        f = open('Compiler.html', 'w')
        
        html_template = f"""
<html>
  <head>
  </head>
  <body style="display: flex; height: 300px; justify-content: center; align-items: center; flex-direction: column; padding: 10px; background-color: #f2f2f2; font-family: Arial, sans-serif;">
    <p style="font-size: 18px; font-weight: bold; margin: 10px;">Execution took <span style="color: #007bff;">{stop:.6f}</span></p>
    <p style="font-size: 16px; margin: 10px; color:#dc3545;">Program output:</p>
    <p style="font-size: 14px; margin: 5px 0; color:#007bff;">{parser.scanner.lexical_errors}</p>
    <p style="font-size: 14px; margin: 5px 0; color:#28a745;">{parser.syntax_errors}</p>
    <p style="font-size: 14px; margin: 5px 0; color:#fd7e14;">{parser.semantic_analyzer.semantic_errors}</p>
  </body>
</html> 


        """
        f.write(html_template)
        f.close()
        file = codecs.open("Compiler.html", 'r', "utf-8")
        print(file.read())
        webbrowser.open('Compiler.html') 
        print("Compilation failed due to the following errors:\n")
        print(parser.scanner.lexical_errors)
        print(parser.syntax_errors)
        print(parser.semantic_analyzer.semantic_errors)
        

    if args.abstract_syntax_tree:
        parser.save_parse_tree()
    if args.symbol_table:
        parser.scanner.save_symbol_table()
    if args.tokens:
        parser.scanner.save_tokens()
    if args.error_files:
        parser.save_syntax_errors()
        parser.scanner.save_lexical_errors()
        parser.semantic_analyzer.save_semantic_errors()
    parser.code_generator.save_output()
    if args.run and not SymbolTableManager.error_flag:
        print("Executing compiled program")
        plat = platform.system()
        if plat == "Windows":
            tester_file = os.path.join(script_dir, "interpreter", "tester_Windows.exe")
        elif plat == "Linux":
            tester_file = os.path.join(script_dir, "interpreter", "tester_Linux.out")
        elif plat == "Darwin":
            tester_file = os.path.join(script_dir, "interpreter", "tester_Mac.out")
        else:
            raise RuntimeError("Unsupported operating system for code execution!")
        output_file = os.path.join(script_dir, "output", "output.txt")
        output_dir = os.path.dirname(output_file)
        if os.path.exists(output_file):
            preexec_fn = limit_virtual_memory if plat == "Linux" else None
            stderr = sp.PIPE if not args.verbose else None
            start = time.time()
            try:
                tester_output = sp.check_output(tester_file, cwd=output_dir, 
                                                stderr=stderr, timeout=10, 
                                                preexec_fn=preexec_fn).decode("utf-8")
            except sp.TimeoutExpired:
                print("RuntimeError: Execution timed out!")
            else:
                if not args.verbose:
                    tester_output = "\n".join([line.replace("PRINT", "").strip() 
                                               for line in tester_output.splitlines()
                                               if line.startswith("PRINT")])
                stop = time.time() - start
                print(f"Execution took {stop:.6f} s")
            print("Program output:")
            print(tester_output)
            #open browser
            f = open('Compiler.html', 'w')
            html_template = f"""
  <html>
    <head>
    </head>
    <body style="display: flex; height: 300px; justify-content: center; align-items: center; flex-direction: column; padding: 10px; font-family: Arial, sans-serif; background-color: #f2f2f2;">
        <p style="font-size: 20px; font-weight: bold; text-align: center; margin-bottom: 10px;">
            Execution took {stop:.6f}
        </p>
        <p style="font-size: 16px; margin-bottom: 5px;">
            Program output:
        </p>
        <p style="font-size: 14px; background-color: white; border: 1px solid black; padding: 10px;">
            {tester_output}
        </p>
    </body>
</html>

"""
            f.write(html_template)
            f.close()
            file = codecs.open("Compiler.html", 'r', "utf-8")
            print(file.read())
            webbrowser.open('Compiler.html') 


if __name__ == "__main__":
    
    parser = argparse.ArgumentParser(description='Simple C Compiler written in Python')
    parser.add_argument("source_file", help="Path to C source file.")
    parser.add_argument('-r', '--run', action='store_true', help='Run the output program after compilation.')
    parser.add_argument('-v', '--verbose', action='store_true', help='Print all used three address codes.')
    parser.add_argument('-ef', '--error-files', action='store_true', help='Save compilation errors to text files.')
    parser.add_argument('-ast', '--abstract-syntax-tree', action='store_true', help='Save abstract syntax tree into a text file.')
    parser.add_argument('-st', '--symbol-table', action='store_true', help='Save symbol table into a text file.')
    parser.add_argument('-t', '--tokens', action='store_true', help='Save lexed tokens into a text file.')
    args = parser.parse_args()
    if not os.path.isabs(args.source_file):
        args.source_file = os.path.abspath(script_dir)
    args = parser.parse_args()
    compile(args)
