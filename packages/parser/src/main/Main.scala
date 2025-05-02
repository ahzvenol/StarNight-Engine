import script.Ast.Script
import script.{Ast, Parser}

import scala.scalajs.js
import scala.scalajs.js.JSConverters.*
import scala.scalajs.js.annotation.JSExportTopLevel

object Main {
  extension (script: Ast.Script)
    def toJS: js.Array[js.Array[js.Dictionary[Any]]] =
      script.actions.map(_.toJS).toJSArray

  extension (action: Ast.Action)
    def toJS: js.Array[js.Dictionary[Any]] =
      action.commands.map(_.toJS).toJSArray

  extension (r: Ast.Runnable)
    def toJS: js.Dictionary[Any] = r match
      case Ast.Command.Async(key, args) =>
        js.Dictionary(
          "key" -> key.name,
          "args" -> js.Dictionary(args.map(_.toJS) *)
        )
      case Ast.Command.Await(key, args) =>
        js.Dictionary(
          "key" -> key.name,
          "await" -> true,
          "args" -> js.Dictionary(args.map(_.toJS) *)
        )
      case Ast.Block.Fork(children) =>
        js.Dictionary(
          "key" -> "fork",
          "args" -> children.map(_.toJS).toJSArray
        )

  extension (arg: Ast.Argument)
    def toJS: (String, Any) =
      arg.key.name -> arg.value.toJS

  extension (lit: Ast.Literal)
    def toJS: Any = lit match
      case Ast.Literal.StringLiteral(v) => v
      case Ast.Literal.NumberLiteral(v) => v
      case Ast.Literal.BooleanLiteral(v) => v

  @JSExportTopLevel("compile")
  def compile(raw: String): Any =
    Parser.parse(raw) match {
      case success:Script => success.toJS
      case failure:String => failure
    }
  end compile

}
