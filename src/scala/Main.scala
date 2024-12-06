import parser.{ChineseCharacterParser, CommentParser, DefineParser, StarNightScriptParser}
import util.Cache

import scala.scalajs.js
import scala.scalajs.js.JSConverters._
import scala.scalajs.js.annotation.JSExportTopLevel

object Main {
  extension[A] (any: A) {
    def |>[B](f: Function[A, B]): B = f(any)
  }

  def println[T](any: T): T = {
    any |> Predef.println
    any
  }

  @JSExportTopLevel("compile")
  def compile(define: String, target: String): js.Function1[Int, js.Array[js.Dictionary[Any]]] = {
    val macroConverter = define
      |> CommentParser.parse
      |> DefineParser.parse

    val rawBook = target
      |> ChineseCharacterParser.parse
      |> CommentParser.parse
      |> StarNightScriptParser.parse

    (i: Int) => rawBook.map(e => Cache(e.flatMap(macroConverter(_)).map(_.toJSDictionary).toJSArray))(i)()
  }

  //  def main(args: Array[String]): Unit = {
  //    val define =
  //      """@对话 名称 文本 文件 => @文字 名称 文本 @音频 目标:"voice" 文件 //对话分解宏
  //        |@背景 文件 => @图片 目标:"背景" x:1280 y:720 文件:{文件}
  //        |
  //        |
  //        |""".stripMargin
  //
  //    val target =
  //      """----
  //        |@对话 名称:"鸽子" 文本:"咕//咕//咕" 文件:"咕.mp3" //这是一段测试对话
  //        |@背景 文件：“bg001.jpg”
  //        |
  //        |----
  //        |@背景 文件：“bg002.jpg”
  //        |
  //        |----
  //        |""".stripMargin
  //
  //    translate(define, target)(0)
  //  }
}
