import parser.StarNightScriptParser

import scala.scalajs.js
import scala.scalajs.js.JSConverters.*
import scala.scalajs.js.annotation.JSExportTopLevel

object Main {
  @JSExportTopLevel("compile")
  def compile(raw: String): js.Array[js.Array[js.Dictionary[Any]]] | js.UndefOr[Nothing] = {
    StarNightScriptParser.parse(raw)
      .map(_.map(_.map(_.toJSDictionary).toJSArray).toJSArray)
      .getOrElse(js.undefined)
  }
}
