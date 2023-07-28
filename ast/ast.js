// 所有AST节点都保存着 token
const timers = require("timers");

class AST{
    constructor(left, token, right) {
        this.left = left;
        this.token = token;
        this.right = right;
    }
}

class NumAST extends AST {
    constructor(token) {
        super(null, token, null);
        this.value = token.value;
    }
}

class BinAST extends AST {
    constructor(left, token, right) {
        super(left, token, right);
    }
}

module.exports = {
    BinAST,
    NumAST
}