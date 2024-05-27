package parser

import scala.util.parsing.combinator.JavaTokenParsers

object CommentParser extends CommentParser {
  def parse(str: String): String = {
    (for {
      s <- str.split("\r?\n|(?<!\n)\r")
    } yield parseAll(comment, s).get).foldLeft("")((a, b) => a + s"$b\r\n")
  }
}

class CommentParser extends JavaTokenParsers {
  def comment: Parser[String] = rep("""[^"/]+""".r | """("[^"]*")""".r) <~ """(//.*)?""".r ^^ (_.foldLeft("")(_ + _))
}