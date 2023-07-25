const {isNumber} = require('./utils')
const {INTEGER, PLUS, MINUS, EOF, DIV, MUL} = require('./constant')
class Token{
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

class Interpreter {
    constructor(text) {
        this.text = text;
        this.pos = 0;
        this.currentToken = null;
        this.currentChar = this.text[this.pos];
    }
    error() {
        throw Error('Error parsing input')
    }
    // 指针向前移动 更新当前字符
    advance() {
        this.pos++;
        if (this.pos >= this.text.length) {
            this.currentChar = null;
        } else {
            this.currentChar = this.text[this.pos];
        }
    }
    // 跳过空格
    skipWhiteSpace() {
        while (this.currentChar !== null && this.currentChar === ' ') {
            this.advance()
        }
    }
    getNextToken() {
        while (this.currentChar !== null) {
            if (this.currentChar === ' ') {
                this.skipWhiteSpace();
            }
            if (isNumber(this.currentChar)) {
                return new Token(INTEGER, this.integer())
            }
            if (this.currentChar === '+') {
                this.advance();
                return new Token(PLUS, '+');
            }
            if (this.currentChar === '-') {
                this.advance();
                return new Token(MINUS, '-');
            }
            if (this.currentChar === '*') {
                this.advance();
                return new Token(MUL, '*');
            }
            if (this.currentChar === '/') {
                this.advance();
                return new Token(DIV, '/');
            }
            this.error();
        }
        return new Token(EOF, null);
    }
    integer() {
        let start = this.pos;
        while (this.currentChar !== null && isNumber(this.currentChar)) {
            this.advance();
        }
        return parseInt(this.text.slice(start, this.pos));
    }
    // 验证当前token是否满足给定的tokenType
    eat(tokenType) {
        if (this.currentToken.type === tokenType) {
            this.currentToken = this.getNextToken();
        } else {
            this.error();
        }
    }
    term () {
        let token = this.currentToken;
        this.eat(INTEGER);
        return token;
    }
    expr() {
        let tokenList = []
        this.currentToken = this.getNextToken();
        tokenList.push(this.term());
        while ([DIV, MUL, MINUS, PLUS].includes(this.currentToken.type)) {
            tokenList.push(this.currentToken);
            if (this.currentToken.type === DIV) {
                this.eat(DIV);
            } else if (this.currentToken.type === MUL){
                this.eat(MUL);
            } else if (this.currentToken.type === MINUS) {
                this.eat(MINUS);
            } else {
                this.eat(PLUS)
            }
            tokenList.push(this.term());
        }
        return doCal(tokenList);
    }

}
function doCal(tokenList) {
    // 转为逆波兰表达式
    let RPN = turnToRPN(tokenList)
    // 计算逆波兰表达式
    return calRPN(RPN)
}
function turnToRPN (tokenList) {
    let resultStack = [], symbolStack = [];
    for (let token of tokenList) {
        if (token.type === INTEGER) {
            resultStack.push(token);
        } else {
            while (symbolStack.length !== 0 && comparePriority(symbolStack[symbolStack.length - 1].value, token.value)) {
                resultStack.push(symbolStack.pop());
            }
            symbolStack.push(token);
        }
    }
    while (symbolStack.length > 0) {
        resultStack.push(symbolStack.pop());
    }
    return resultStack;
}
// symbol1（栈顶） > symbol2（当前token） return true else false
function comparePriority(symbol1, symbol2) {
    let map = {
        '/': 1,
        '*': 1,
        '+': 0,
        '-': 0
    }
    return map[symbol1] > map[symbol2];
}
function mapFunc() {
    return {
        '/': (n1, n2) => n1 / n2,
        '*': (n1, n2) => n1 * n2,
        '+': (n1, n2) => n1 + n2,
        '-': (n1, n2) => n1 - n2,
    }
}
function calRPN(RPN) {
    console.log(RPN)
    let res;
    let stack = [];
    for (let token of RPN) {
        if (token.type === INTEGER) {
            stack.push(token.value);
        } else {
            let n1 = stack.pop();
            let n2 = stack.pop();
            res = mapFunc()[token.value](n2, n1);
            stack.push(res);
        }
    }
    return stack.pop();
}
const interpreter = new Interpreter(" 2  + 2323 * 8 / 8 + 1 + ");
console.log(interpreter.expr());

