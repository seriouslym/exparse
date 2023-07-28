const {isNumber} = require("./utils");
const {INTEGER, PLUS, MINUS, MUL, DIV, LEFT, RIGHT, EOF} = require("./constant");
const {NumAST, BinAST} = require("./ast/ast");

class Token{
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
    toString() {
        return `Token(${this.type}, ${this.value})`
    }
}

class Lexer{
    constructor(text) {
        this.text = text;
        this.pos = 0;
        this.currentChar = this.text[this.pos];
        // 初始化的时候就赋值 避免在expr中递归调用出错
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
    error() {
        throw new Error('Invalid character')
    }
    getNextToken() {
        while (this.currentChar !== null) {
            if (this.currentChar === ' ') {
                this.skipWhiteSpace();
                continue;
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
            if (this.currentChar === '(') {
                this.advance();
                return new Token(LEFT, '(');
            }
            if (this.currentChar === ')') {
                this.advance();
                return new Token(RIGHT, ')');
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
}
class Parser {
    constructor(lexer) {
        this.lexer = lexer;
        this.currentToken = this.lexer.getNextToken();
    }
    error() {
        throw Error('Invalid syntax')
    }
    // 验证当前token是否满足给定的类型 并获取下一个token
    eat(tokenType) {
        if (this.currentToken.type === tokenType) {
            this.currentToken = this.lexer.getNextToken();
        } else {
            this.error();
        }
    }
    // 递归下降文法
    // factor: Integer | (expr)
    factor() {
        let token = this.currentToken;
        if (token.type === INTEGER) {
            this.eat(INTEGER);
            return new NumAST(token);
        } else if (token.type === LEFT) {
            this.eat(LEFT);
            let node = this.expr();
            this.eat(RIGHT);
            return node;
        }
    }
    // term: factor[(MUL | DIV)factor]*
    term () {
        let node = this.factor();
        while ([DIV, MUL].includes(this.currentToken.type)) {
            let token = this.currentToken;
            if (this.currentToken.type === DIV) {
                this.eat(DIV);
            } else {
                this.eat(MUL);
            }
            node = new BinAST(node, token, this.factor());
        }
        return node;
    }
    // expr : term[(PLUS | MINUS)term]*
    expr() {
        let node = this.term();
        while ([MINUS, PLUS].includes(this.currentToken.type)) {
            let token = this.currentToken;
            if (this.currentToken.type === MINUS) {
                this.eat(MINUS);
            } else {
                this.eat(PLUS);
            }
            node = new BinAST(node, token, this.term());
        }
        return node;
    }

    label() {

    }



}

let lexer = new Lexer(" 7 + (((3 + 2)))");
let parser = new Parser(lexer);
let root = parser.expr();
var text = ""
function visitor(root) {
    if (root.left === null && root.right === null) {
        return root.token.value;
    }
    let left = visitor(root.left);
    let right = visitor(root.right);
    let res;
    if ([MUL, DIV, MINUS, PLUS].includes(root.token.type)) {
        if (root.token.type === MUL) {
            res = left * right;
        } else if (root.token.type === DIV) {
            res = left / right;
        } else if (root.token.type === PLUS) {
            res = left + right;
        } else if (root.token.type === MINUS) {
            res = left - right;
        }
    }
    return res;

}





