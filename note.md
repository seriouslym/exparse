# 上下文无关文法翻译成code规则  
eg: expr: factor((MUL | DIV)factor)*  
    factor: INTEGER  
终结符：不能再分解的最小单位符号，上述的MUL DIV INTEGER  
非终结符：用于描述语言的语法规则，由其他非终结符和终结符通过一定规则展开，expr，factor  
文法 -> code
+ Rule 转换为同名的函数，对该规则的引用转换为调用该函数  
+ (a1 | a2 | aN) -> if-else if-else
+ (...)* -> while loop
+ for each token T -> eat(T)

