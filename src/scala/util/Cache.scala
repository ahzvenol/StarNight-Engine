package util

object Cache {
  def apply[T](f: => T): () => T = {
    lazy val value: T = f
    () => value
  }
}