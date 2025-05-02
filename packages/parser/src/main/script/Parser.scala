package script

import script.Ast.{Action, Argument, Command, Identifier, Literal, Script}

import scala.util.matching.Regex
import scala.util.parsing.combinator.RegexParsers

object Parser extends Parser {
  def parse(target: String): Either[String, Script] =
    parse(actionSeq, target) match
      case Success(result, _) => Right(result)
      case NoSuccess(msg, next) => Left(s"[${next.pos}] : $msg\n\n${next.pos.longString}".replaceAll("\\R", "\r\n"))
  end parse
}

class Parser extends RegexParsers {
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

  def identifier: Parser[Identifier] = """[\u4e00-\u9fa5_a-zA-Z0-9]+""".r ^^ Identifier.apply

  def actionSeparator: Parser[String] = """\s*-{4,}\s*""".r

  def floatingPointLiteral: Parser[Literal.NumberLiteral] =
    """-?(\d+(\.\d*)?|\d*\.\d+)([eE][+-]?\d+)?[fFdD]?""".r ^^ (_.toDouble) ^^ Literal.NumberLiteral.apply

  def stringLiteral: Parser[Literal.StringLiteral] =
    (""""""".r ~> """([^"\x00-\x1F\x7F\\]|\\[\\/'"bfnrt]|\\u[a-fA-F0-9]{4})*""".r <~ """"""".r |
      "/".r ~> """([^/\x00-\x1F\x7F\\]|\\[\\/'"bfnrt]|\\u[a-fA-F0-9]{4})*""".r <~ "/".r)
      ^^ unescape ^^ Literal.StringLiteral.apply

  def booleanLiteral: Parser[Literal.BooleanLiteral] =
    "(true|false)".r ^^ (_.toBoolean) ^^ Literal.BooleanLiteral.apply

  def literal: Parser[Literal] = floatingPointLiteral | booleanLiteral | stringLiteral

  def argument: Parser[Argument] =
    identifier ~ "=" ~ literal ^^ { case key ~ _ ~ value => Argument(key, value) }

  def command: Parser[Command] =
    ("@" | "#") ~ identifier ~ rep("""\s+""".r ~> argument) <~ """\s*""".r ^^ {
      case "@" ~ key ~ args => Command.Async(key, args)
      case "#" ~ key ~ args => Command.Await(key, args)
    }

  def forkBlock: Parser[Command.Async] =
    ("{" ~> """\s*""".r ~> commandSeq <~ """\s*""".r <~ "}") ^^ (cmds => Command.Async(Identifier("fork"), cmds))

  def commandSeq: Parser[List[Command]] = rep(command | forkBlock)

  def action: Parser[Action] = commandSeq <~ actionSeparator ^^ Action.apply

  def actionSeq: Parser[Script] = actionSeparator ~> rep(action) ^^ Script.apply
}
