package parser

import scala.util.parsing.combinator.JavaTokenParsers

object PreprocessingParser extends PreprocessingParser {
  def parse(str: String): String = parseAll(content, str).get
}

class PreprocessingParser extends JavaTokenParsers {
  override def skipWhitespace = false

  def sanitize(str: String): String =
    str.split("\\R").mkString

  def other: Parser[String] = s"""[^/"]+""".r ^^ sanitize

  def comment: Parser[String] = "///.*".r ^^ (_ => "")

  def string: Parser[String] =
    """"([^"\x00-\x1F\x7F\\]|\\[\\/'"bfnrt]|\\u[a-fA-F0-9]{4})*""".r | """/([^/\x00-\x1F\x7F\\]|\\[\\/'"bfnrt]|\\u[a-fA-F0-9]{4})*/""".r

  def content: Parser[String] = rep(other | comment | string) ^^ (_.mkString)
}
