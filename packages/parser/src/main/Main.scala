import script.Parser

import scala.scalajs.js
import scala.scalajs.js.annotation.JSExportTopLevel

object Main {
  @JSExportTopLevel("compile")
  def compile(raw: String): Any = {
    Parser.parse(raw).toOption.get
  }
}
