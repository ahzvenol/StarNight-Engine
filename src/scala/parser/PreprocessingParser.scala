package parser

import scala.jdk.CollectionConverters.*
import scala.util.parsing.combinator.RegexParsers

object PreprocessingParser extends PreprocessingParser {
  def parse(str: String): String =
    (parseAll(rep(other ~ (quote ~> literal <~ quote) ~ other), str): @unchecked) match
      case Success(result, _) => result.map {
        case left ~ string ~ right => s"""${sanitize(left)}"${unescape(string)}"${sanitize(right)}"""
      }.reduce(_ + _)
      case NoSuccess(_, _) => sanitize(str)
  end parse

  def unescape(str: String): String = str
    .replaceAll("""\\'""", "\'")
    .replaceAll("""\\"""", "\"")
    .replaceAll("""\\b""", "\b")
    .replaceAll("""\\f""", "\f")
    .replaceAll("""\\n""", "\n")
    .replaceAll("""\\r""", "\r")
    .replaceAll("""\\t""", "\t")
    .replaceAll("""\\\\""", "\\")
  end unescape

  def sanitize(str: String): String =
    str.replaceAll("【", "[")
      .replaceAll("】", "]")
      .replaceAll("，", ",")
      .replaceAll("：", ":")
      .lines().toList.asScala
      .map(_.replaceAll("""(//.*)?""", ""))
      .mkString
  end sanitize

}

class PreprocessingParser extends RegexParsers {
  override def skipWhitespace = false

  val QUOTE: String = """“”""""

  def quote: Parser[String] = s"""[$QUOTE]""".r

  def other: Parser[String] = s"""[^$QUOTE]*""".r

  def literal: Parser[String] = ("""([^""" + QUOTE + """\x00-\x1F\x7F\\]|\\[\\'"bfnrt]|\\u[a-fA-F0-9]{4})*""").r

}