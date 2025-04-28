package util

object FPUtil {
  extension [A](value: A) inline infix def |>[B](f: Function[A, B]): B = f(value)
}
