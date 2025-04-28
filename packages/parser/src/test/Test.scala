import parser.{PreprocessingParser, StarNightScriptParser}
import util.FPUtil.|>

object Test {
  def main(args: Array[String]): Unit = {
    val target =
      """----
        |
        |@对话 名称="鸽子" 文本="咕///咕\n///咕" 文件=/咕.mp3/
        |@背景 文件=/bg002.jpg/ ///11
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
        |@对话 名称="鸽子" 文本="咕///咕\n///咕" 文件=/咕.mp3/
        |}
        |  ----
        |""".stripMargin

    println(target |> PreprocessingParser.parse |> StarNightScriptParser.parse)
  }
}
