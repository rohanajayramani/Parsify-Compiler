from flask import Flask, render_template, request

class IntermediateCodeGenerator:
    def __init__(self):
        self.intermediate_code = []

    def generate(self, cpp_code):
        lines = cpp_code.split("\n")
        for line in lines:
            line = line.strip()
            if line.startswith("//"):
                continue  # Skip comment lines

            if "=" in line:
                tokens = line.split("=")
                result_var = tokens[0].strip()
                expression = tokens[1].strip()

                intermediate_line = f"{result_var} = {expression}"
                self.intermediate_code.append(intermediate_line)

    def get_code(self):
        return "\n".join(self.intermediate_code)[:-1]


app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    cpp_code = request.form['cpp_code']

    generator = IntermediateCodeGenerator()
    generator.generate(cpp_code)
    intermediate_code = generator.get_code()

    return '<br>'.join(intermediate_code.split('\n')) + ';'

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5002, debug=True)

