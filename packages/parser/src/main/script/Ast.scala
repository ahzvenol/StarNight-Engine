package script

import scala.util.parsing.input.Position

object Ast:
  sealed trait Ranged(start: Position,end: Position)

  case class Script(actions: List[Action])

  case class Action(commands: List[Command])

  enum Command {
    case Async(key: Identifier, args: List[Argument] | List[Command])
    case Await(key: Identifier, args: List[Argument] | List[Command])
  }

  case class Argument(key: Identifier, value: Literal)

  case class Identifier(name: String)

  enum Literal {
    case StringLiteral(value: String)
    case NumberLiteral(value: Double)
    case BooleanLiteral(value: Boolean)
  }

end Ast

