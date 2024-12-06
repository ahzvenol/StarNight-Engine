package parser

import scala.util.parsing.combinator.JavaTokenParsers

object StarNightScriptParser extends StarNightScriptParser {
  def parse(target: String): List[List[Map[String, Any]]] = {
    val res = parseAll(actions, target.replaceAll("\r?\n|(?<!\n)\r", ""))
    if (res.successful) res.get
    //tag:先抛着异常，有需求再改
    else throw new Exception(res.toString)
  }
}

class StarNightScriptParser extends JavaTokenParsers {

  override def skipWhitespace = false

  private def unescape(str: String): String = str
    .replaceAll("""\\'""", "\'")
    .replaceAll("""\\"""", "\"")
    .replaceAll("""\\b""", "\b")
    .replaceAll("""\\f""", "\f")
    .replaceAll("""\\n""", "\n")
    .replaceAll("""\\r""", "\r")
    .replaceAll("""\\t""", "\t")
    .replaceAll("""\\\\""", "\\")
  // issue:"\"要不要强制写成"\\"?

  def key: Parser[String] = """[\u4e00-\u9fa5_a-zA-Z0-9]+""".r

  def num: Parser[Double] = floatingPointNumber ^^ (_.toDouble)

  def str: Parser[String] = stringLiteral ^^ (s => unescape(s.substring(1, s.length() - 1)))

  def bool: Parser[Boolean] = "(true|false)".r ^^ (_.toBoolean)

  def array: Parser[List[Any]] = "[" ~> rep(value <~ ",?".r) <~ "]"

  def value: Parser[Any] = array | num | bool | str

  def commandSign: Parser[String] = "@" ~> key <~ "\\s+".r

  def commandKeyValuePair: Parser[(String, Any)] = (key <~ ":") ~ value ^^ {
    case k ~ v => (k, v)
  }

  def command: Parser[Map[String, Any]] = {
    commandSign ~ rep(commandKeyValuePair <~ "\\s*".r) ^^ {
      case k ~ l => Map("@" -> k) ++ l.toMap
    }
  }

  def commands: Parser[List[Map[String, Any]]] = rep(command)

  def actions: Parser[List[List[Map[String, Any]]]] = """-{4,}""".r ~> rep(commands <~ """-{4,}""".r)
}
