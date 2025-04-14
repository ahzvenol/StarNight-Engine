import parser.{DefineParser, PreprocessingParser, StarNightScriptParser}
import util.Cache
import util.FPUtil.|>

import scala.scalajs.js
import scala.scalajs.js.JSConverters.*
import scala.scalajs.js.`new`.target
import scala.scalajs.js.annotation.JSExportTopLevel

object Main {
  // @JSExportTopLevel("compile")
  // def compile(target: String): js.Function1[Int, js.Array[js.Dictionary[Any]]] = {
  //   val macroConverter = define
  //     |> DefineParser.parse
  // 
  //   val rawBook = target
  //     |> PreprocessingParser.parse
  //     |> StarNightScriptParser.parse
  // 
  //   (i: Int) => rawBook.map(e => Cache(e.flatMap(macroConverter(_)).map(_.toJSDictionary).toJSArray))(i)()
  // }

  @JSExportTopLevel("compile")
  def compile(target: String): Unit = {
    val define =
      """@对话 名称 文本 文件 => @文字 名称 文本 @音频 目标:"voice" 文件 //对话分解宏
        |@背景 文件 => @图片 目标:"背景" x:1280 y:720 文件:{文件}
        |
        |
        |""".stripMargin

    val target =
      """----
        |
        |@对话 名称= "鸽子" 文本="咕///咕\n///咕" 文件=/咕.mp3/
        |@背景 文件=/bg002.jpg/ ///11
        |
        |----
        |@背景 文件=/bg001.jpg\/\/\// ///11
        |{
        |
        |}
        |{
        |
        |@背景 文件=/{bg001.jpg----}/
        |
        |{
        |#背景 文件=/bg001.jpg/
        |}
        |@对话 名称= "鸽子" 文本="咕///咕\n///咕" 文件=/咕.mp3/
        |}
        |----
        |""".stripMargin

    println(target |> PreprocessingParser.parse |> StarNightScriptParser.parse)
  }

  def main(args: Array[String]): Unit = {
    val define =
      """@对话 名称 文本 文件 => @文字 名称 文本 @音频 目标:"voice" 文件 //对话分解宏
        |@背景 文件 => @图片 目标:"背景" x:1280 y:720 文件:{文件}
        |
        |
        |""".stripMargin

    val target =
      """----
        |
        |@对话 名称= "鸽子" 文本="咕///咕\n///咕" 文件=/咕.mp3/
        |@背景 文件=/bg002.jpg/ ///11
        |
        |----
        |@背景 文件=/bg001.jpg\/\/\// ///11
        |{
        |
        |}
        |{
        |
        |@背景 文件=/{bg001.jpg----}/
        |
        |{
        |#背景 文件=/bg001.jpg/
        |}
        |@对话 名称= "鸽子" 文本="咕///咕\n///咕" 文件=/咕.mp3/
        |}
        |----
        |""".stripMargin

    println(target |> PreprocessingParser.parse |> StarNightScriptParser.parse)
  }
}
