package script

import script.Ast.{Action, Argument, Block, Command, Identifier, Literal, Runnable, Script}

import scala.util.parsing.combinator.RegexParsers

object Parser extends Parser {
  def parse(target: String): Script | String =
    parseAll(script, target) match {
      case Success(result, _) => result
      case Failure(msg, next) => s"[${next.pos}] failure: $msg\n\n${next.pos.longString}".replaceAll("\\R", "\r\n")
      case Error(msg, next) => s"[${next.pos}] error: $msg\n\n${next.pos.longString}".replaceAll("\\R", "\r\n")
    }
  end parse
}

class Parser extends RegexParsers {
  override val skipWhitespace = false

  def unescape(str: String): String =
    str
      .replaceAll("""(?<!\\)\\(?!\\)/""", "/")
      .replaceAll("""(?<!\\)\\(?!\\)'""", "\'")
      .replaceAll("""(?<!\\)\\(?!\\)"""", "\"")
      .replaceAll("""(?<!\\)\\(?!\\)b""", "\b")
      .replaceAll("""(?<!\\)\\(?!\\)f""", "\f")
      .replaceAll("""(?<!\\)\\(?!\\)n""", "\n")
      .replaceAll("""(?<!\\)\\(?!\\)r""", "\r")
      .replaceAll("""(?<!\\)\\(?!\\)t""", "\t")
      .replace("""\\""", "\\")
  end unescape


  def space: Parser[String] = """[\s\t\r\n]+""".r

  def comment: Parser[String] = """///.*""".r

  def ignored: Parser[List[String]] = rep(comment | space)

  def identifier: Parser[Identifier] = """[\u4e00-\u9fa5_a-zA-Z0-9]+""".r ^^ Identifier.apply

  def number: Parser[Literal.NumberLiteral] =
    """-?(\d+(\.\d*)?|\d*\.\d+)([eE][+-]?\d+)?[fFdD]?""".r ^^ (_.toDouble) ^^ Literal.NumberLiteral.apply

  def string: Parser[Literal.StringLiteral] =
    (""""""".r ~> """([^"\\]|\\[\\/'"bfnrt]|\\u[a-fA-F0-9]{4})*""".r <~ """"""".r |
      "/".r ~> """([^/\\]|\\[\\/'"bfnrt]|\\u[a-fA-F0-9]{4})*""".r <~ "/".r)
      ^^ unescape ^^ (_.stripMargin) ^^ Literal.StringLiteral.apply

  def boolean: Parser[Literal.BooleanLiteral] =
    "(true|false)".r ^^ (_.toBoolean) ^^ Literal.BooleanLiteral.apply

  def literal: Parser[Literal] = number | boolean | string

  def argument: Parser[Argument] =
    identifier ~ "=" ~ literal ^^ { case key ~ _ ~ value => Argument(key, value) }

  def marker: Parser["@" | "#"] = ("@" | "#").asInstanceOf[Parser["@" | "#"]]

  def command: Parser[Command] =
    marker ~ identifier ~ rep(ignored ~> argument) ^^ {
      case "@" ~ key ~ args => Command.Async(key, args)
      case "#" ~ key ~ args => Command.Await(key, args)
    }

  def fork: Parser[Block.Fork] =
    "{" ~> ignored.? ~> rep(runnable) <~ ignored.? <~ "}" ^^ Block.Fork.apply

  def runnable: Parser[Runnable] = ignored.? ~> (command | fork) <~ ignored.?

  def action: Parser[Action] = rep(runnable) ^^ Action.apply

  def script: Parser[Script] =
    ignored.? ~> """-{4,}""".r ~> rep(action <~ """-{4,}""".r <~ ignored.?) ^^ Script.apply
}
