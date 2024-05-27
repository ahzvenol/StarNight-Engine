package parser

object DefineParser extends DefineParser {
  def parse(target: String): Map[String, Any] => List[Map[String, Any]] = {
    val functionList = for {
      s <- target.split("\r?\n|(?<!\n)\r")
      (key, rule) ~ placeholderCommandList = parseAll(define, s).get
    } yield replaceFunctionMarker(key, rule, placeholderCommandList)
    map => functionList.foldLeft(List(map))((res, fun) => res.flatMap(fun(_)))
  }

  private def replaceFunctionMarker(key: String, rule: List[(String, Boolean)], placeholderCommandList: List[Map[String, Any]])
  : Map[String, Any] => List[Map[String, Any]] = {
    def macroReplace(fromMap: Map[String, Any]): List[Map[String, Any]] = {
      if (fromMap("@") != key) return List(fromMap)
      val rMap = rule.foldLeft(Map[String, Any]())((m, e) => e match {
        case (key, require) =>
          if (fromMap.contains(key)) m ++ Map(key -> fromMap(key))
          else if (!require) m
          else return List(fromMap)
      })
      // !require时,rMap(value)可能为空,目前先限制此类情况不要使用
      placeholderCommandList.map(e => e.map {
        case (key, Placeholder(value)) => (key, rMap(value))
        case other => other
      })
    }

    macroReplace
  }
}

// 目前的宏作用为把命令的某个参数值转换到N个命令的N个参数中(N>=0)
class DefineParser extends StarNightScriptParser {

  case class Placeholder(value: String)

  def commandKeyInterpolationValuePair: Parser[Map[String, Any]] = (key <~ ":") ~ ("{" ~> key <~ "}") ^^ {
    case k ~ v => Map(k -> Placeholder(v))
  }

  def commandKeyInterpolationValueAbbreviation: Parser[Map[String, Any]] = key ^^ (e => Map(e -> Placeholder(e)))

  def defineFrom: Parser[(String, List[(String, Boolean)])] = {
    commandSign ~ rep(key ~ "\\??".r <~ "\\s+".r) ^^ {
      case k ~ l => (k, l.map {
        case k ~ r => (k, !r.equals("?"))
      })
    }
  }

  def defineTo: Parser[List[Map[String, Any]]] = {
    rep1(commandSign ~ rep((commandKeyValuePair | commandKeyInterpolationValuePair | commandKeyInterpolationValueAbbreviation) <~ "\\s*".r) ^^ {
      case k ~ l => Map("@" -> k) ++ l.foldLeft(Map[String, Any]())((m, e) => m ++ e)
    })
  }

  def define: Parser[(String, List[(String, Boolean)]) ~ List[Map[String, Any]]] = (defineFrom <~ "=> ") ~ defineTo
}
