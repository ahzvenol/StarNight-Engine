import org.scalajs.linker.interface.ESVersion

enablePlugins(ScalaJSPlugin)

name := "Parser"

version := "0.1"

scalaVersion := "3.5.2"

libraryDependencies += "org.scala-lang.modules" %%% "scala-parser-combinators" % "2.1.1"

scalaJSUseMainModuleInitializer := false

scalaJSLinkerConfig ~= {
  _.withModuleKind(ModuleKind.ESModule)
    .withESFeatures(_.withESVersion(ESVersion.ES2021))
}

Compile / mainClass := Some("Main")

Compile / unmanagedSourceDirectories := Seq(baseDirectory.value / "src" / "scala")

//scalaJSLinkerOutputDirectory := baseDirectory.value / "js"