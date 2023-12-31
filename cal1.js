const {isNumber} = require('./utils')
const {INTEGER, PLUS, MINUS, EOF, DIV, MUL,LEFT, RIGHT} = require('./constant')
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
        this.currentChar = this.text[this.pos];
        // 初始化的时候就赋值 避免在expr中递归调用出错
        this.currentToken = this.getNextToken();
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
    // 验证当前token是否满足给定的类型 并获取下一个token
    eat(tokenType) {
        if (this.currentToken.type === tokenType) {
            this.currentToken = this.getNextToken();
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
            return token.value;
        } else if (token.type === LEFT) {
            this.eat(LEFT);
            let result = this.expr();
            this.eat(RIGHT);
            return result;
        }
    }
    // term: factor[(MUL | DIV)factor]*
    term () {
        let res = this.factor();
        while ([DIV, MUL].includes(this.currentToken.type)) {
            if (this.currentToken.type === DIV) {
                this.eat(DIV);
                res /= this.factor()
            } else {
                this.eat(MUL);
                res *= this.factor();
            }
        }
        return res;
    }
    // expr : term[(PLUS | MINUS)term]*
    expr() {
        let res = this.term();
        while ([MINUS, PLUS].includes(this.currentToken.type)) {
            if (this.currentToken.type === MINUS) {
                this.eat(MINUS);
                res -= this.term();
            } else {
                this.eat(PLUS);
                res += this.term()
            }

        }
        return res;
    }

}

const interpreter = new Interpreter("   1 + (2 * 3 + (1 - 1))");
console.log(interpreter.expr());

