package parser

import scala.scalajs.js
import scala.util.parsing.combinator.RegexParsers

object StarNightScriptParser extends StarNightScriptParser {
  def parse(target: String): Either[String, List[List[Map[String, Any]]]] =
    (parseAll(actions, target): @unchecked) match
      case Success(result, _) => Right(result)
      case NoSuccess(msg, next) => Left(s"[${next.pos}] : $msg\n\n${next.pos.longString}")
}

class StarNightScriptParser extends RegexParsers {

  override def skipWhitespace = false

  type Primitive = js.UndefOr[Double | Boolean | String]

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


  def whitespace: Parser[String] = "\\s*".r

  def kvSeparator: Parser[String] = "=".r

  def key: Parser[String] = """[\u4e00-\u9fa5_a-zA-Z0-9]+""".r

  def number: Parser[Double] = """-?(\d+(\.\d*)?|\d*\.\d+)([eE][+-]?\d+)?[fFdD]?""".r ^^ (_.toDouble)

  def string: Parser[String] =
    ("\"".r ~> """([^"\x00-\x1F\x7F\\]|\\[\\/'"bfnrt]|\\u[a-fA-F0-9]{4})*""".r <~ "\"".r |
      "/".r ~> """([^/\x00-\x1F\x7F\\]|\\[\\/'"bfnrt]|\\u[a-fA-F0-9]{4})*""".r <~ "/".r) ^^ unescape

  def boolean: Parser[Boolean] = "(true|false)".r ^^ (_.toBoolean)

  def undefined: Parser[Primitive] = "undefined".r ^^ (_ => js.undefined)

  def primitive: Parser[Primitive] = number | boolean | string | undefined

  def asyncCommandKey: Parser[String] = "@" ~> key <~ "\\s+".r

  def awaitCommandKey: Parser[String] = "#" ~> key <~ "\\s+".r

  def commandArg: Parser[(String, Primitive)] =
    (key <~ kvSeparator <~ whitespace) ~ primitive ^^ { case k ~ v => (k, v) }

  def command: Parser[Map[String, Any]] =
    asyncCommandKey ~ rep(commandArg <~ whitespace) ^^ { case key ~ args => Map("key" -> key, "args" -> args.toMap) } |
      awaitCommandKey ~ rep(commandArg <~ whitespace) ^^ { case key ~ args => Map("key" -> key, "await" -> true, "args" -> args.toMap) }

  def fork: Parser[Map[String, Any]] =
    ("\\{".r ~> commands <~ "}".r) ^^ (cmds => Map("key" -> "fork", "args" -> cmds))

  def commands: Parser[List[Map[String, Any]]] = rep(command | fork)

  def actionSeparator: Parser[String] = """-{4,}""".r

  def actions: Parser[List[List[Map[String, Any]]]] = actionSeparator ~> rep(commands <~ actionSeparator)
}
