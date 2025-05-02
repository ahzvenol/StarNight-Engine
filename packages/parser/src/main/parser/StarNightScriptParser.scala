package parser

import scala.util.matching.Regex
import scala.util.parsing.combinator.RegexParsers

object StarNightScriptParser extends StarNightScriptParser {
  def parse(target: String): Either[String, List[List[Map[String, Any]]]] =
    parseAll(ActionSeq, target) match
      case Success(result, _) => Right(result)
      case NoSuccess(msg, next) => Left(s"[${next.pos}] : $msg\n\n${next.pos.longString}".replaceAll("\\R", "\r\n"))
  end parse
}

class StarNightScriptParser extends RegexParsers {
  override val whiteSpace: Regex = "\\R|///.*\\R*".r

  def unescape(str: String): String =
    str
      .replaceAll("""\\/""", "/")
      .replaceAll("""\\'""", "\'")
      .replaceAll("""\\"""", "\"")
      .replaceAll("""\\b""", "\b")
      .replaceAll("""\\f""", "\f")
      .replaceAll("""\\n""", "\n")
      .replaceAll("""\\r""", "\r")
      .replaceAll("""\\t""", "\t")
      .replaceAll("""\\\\""", "\\")
  end unescape

  def identifier: Parser[String] = """[\u4e00-\u9fa5_a-zA-Z0-9]+""".r

  def actionSeparator: Parser[String] = """\s*-{4,}\s*""".r

  def floatingPointLiteral: Parser[Double] = """-?(\d+(\.\d*)?|\d*\.\d+)([eE][+-]?\d+)?[fFdD]?""".r ^^ (_.toDouble)

  def stringLiteral: Parser[String] =
    (""""""".r ~> """([^"\x00-\x1F\x7F\\]|\\[\\/'"bfnrt]|\\u[a-fA-F0-9]{4})*""".r <~ """"""".r |
      "/".r ~> """([^/\x00-\x1F\x7F\\]|\\[\\/'"bfnrt]|\\u[a-fA-F0-9]{4})*""".r <~ "/".r) ^^ unescape

  def booleanLiteral: Parser[Boolean] = "(true|false)".r ^^ (_.toBoolean)

  def Literal: Parser[Double | Boolean | String] = floatingPointLiteral | booleanLiteral | stringLiteral

  def Argument: Parser[(String, Double | Boolean | String)] =
    identifier ~ "=" ~ Literal ^^ { case key ~ _ ~ value => (key, value) }

  def Command: Parser[Map[String, Any]] =
    ("@" | "#") ~ identifier ~ rep("""\s+""".r ~> Argument) <~ """\s*""".r ^^ {
      case "@" ~ key ~ args => Map("key" -> key, "args" -> args.toMap)
      case "#" ~ key ~ args => Map("key" -> key, "await" -> true, "args" -> args.toMap)
    }

  def ForkBlock: Parser[Map[String, Any]] =
    ("{" ~> """\s*""".r ~> CommandSeq <~ """\s*""".r <~ "}") ^^ (cmds => Map("key" -> "fork", "args" -> cmds))

  def CommandSeq: Parser[List[Map[String, Any]]] = rep(Command | ForkBlock)

  def Action: Parser[List[Map[String, Any]]] = CommandSeq <~ actionSeparator

  def ActionSeq: Parser[List[List[Map[String, Any]]]] = actionSeparator ~> rep(Action)
}
