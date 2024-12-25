package parser

import scala.util.parsing.combinator.RegexParsers

object StarNightScriptParser extends StarNightScriptParser {
  def parse(target: String): Either[String, List[List[Map[String, Any]]]] =
    (parseAll(actions, target): @unchecked) match
      case Success(result, _) => Right(result)
      case NoSuccess(msg, next) => Left(s"[${next.pos}] : $msg\n\n${next.pos.longString}")
}

class StarNightScriptParser extends RegexParsers {

  override def skipWhitespace = false

  type Primitive = Double | Boolean | String

  def whitespace: Parser[String] = "\\s*".r

  def quote: Parser[String] = "\"".r

  def colon: Parser[String] = ":".r

  def key: Parser[String] = """[\u4e00-\u9fa5_a-zA-Z0-9]+""".r

  def number: Parser[Double] = """-?(\d+(\.\d*)?|\d*\.\d+)([eE][+-]?\d+)?[fFdD]?""".r ^^ (_.toDouble)

  def literal: Parser[String] = """([^"\x00-\x1F\x7F\\]|\\[\\'"bfnrt]|\\u[a-fA-F0-9]{4})*""".r

  def string: Parser[String] = quote ~> literal <~ quote

  def boolean: Parser[Boolean] = "(true|false)".r ^^ (_.toBoolean)

  def primitive: Parser[Primitive] = number | boolean | string

  def commandSign: Parser[String] = "@" ~> key <~ "\\s+".r

  def commandArg: Parser[(String, Primitive)] = (key <~ colon <~ whitespace) ~ primitive ^^ {
    case k ~ v => (k, v)
  }

  def command: Parser[Map[String, Primitive]] = {
    commandSign ~ rep(commandArg <~ whitespace) ^^ {
      case k ~ l => Map("@" -> k) ++ l.toMap
    }
  }

  def commands: Parser[List[Map[String, Primitive]]] = rep(command)

  def separator: Parser[String] = """-{4,}""".r

  def actions: Parser[List[List[Map[String, Primitive]]]] = separator ~> rep(commands <~ separator)
}
