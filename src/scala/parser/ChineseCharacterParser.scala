package parser

import scala.util.parsing.combinator.JavaTokenParsers

object ChineseCharacterParser extends ChineseCharacterParser {
  def parse(str: String): String = {
    def zhCharToEn(str: String): String = {
      val toEnQuotationMark = matchZhStr ^^ {
        case a ~ b ~ c => a + s"\"${b.substring(1, b.length() - 1)}\"" + c
      }
      (parseAll(rep1(toEnQuotationMark), str) match {
        case Success(res, _) => res.reduce(_ + _)
        case NoSuccess(_) => str
      }).replaceAll("【", "[")
        .replaceAll("】", "]")
        .replaceAll("，", ",")
        .replaceAll("：", ":")
    }

    parseAll(rep1(matchStr), str) match {
      case Success(res, _) => res.map {
        case a ~ b ~ c => zhCharToEn(a) + b + zhCharToEn(c)
      }.reduce(_ + _)
      case NoSuccess(_) => zhCharToEn(str)
    }
  }
}

class ChineseCharacterParser extends JavaTokenParsers {

  override def skipWhitespace = false

  def notStr: Parser[String] = """[^"]*""".r

  def matchStr: Parser[String ~ String ~ String] = notStr ~ stringLiteral ~ notStr

  def zhString: Parser[String] = ("(“|”)" + """([^"\x00-\x1F\x7F\\]|\\[\\'"bfnrt]|\\u[a-fA-F0-9]{4})*""" + "(“|”)").r

  def matchZhStr: Parser[String ~ String ~ String] = """[^“”]*""".r ~ zhString ~ """[^“”]*""".r
}