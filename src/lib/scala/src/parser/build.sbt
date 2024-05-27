import org.scalajs.linker.interface.ESVersion

enablePlugins(ScalaJSPlugin)

name := "parser"

version := "0.1"

scalaVersion := "2.13.8"

libraryDependencies += "org.scala-lang.modules" %%% "scala-parser-combinators" % "2.1.1"

scalaJSUseMainModuleInitializer := true

scalaJSLinkerConfig ~= {_.withModuleKind(ModuleKind.ESModule)}

scalaJSLinkerConfig ~= { _.withESFeatures(_.withESVersion(ESVersion.ES2018)) }

mainClass in Compile := Some("Define")

//scalaJSLinkerOutputDirectory := baseDirectory.value / "js"

scalaJSUseMainModuleInitializer := false