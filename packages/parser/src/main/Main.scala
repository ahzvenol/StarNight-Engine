import script.Ast.Script
import script.{Ast, Parser}
import script.AstJSConverter.*

import scala.scalajs.js
import scala.scalajs.js.annotation.JSExportTopLevel

object Main:

  @JSExportTopLevel("compile")
  def compile(raw: String): js.Any =
    Parser.parse(raw) match {
      case success: Script => success.toJS
      case failure: String => failure
    }
  end compile

end Main

