import org.scalajs.linker.interface.ESVersion

enablePlugins(ScalaJSPlugin)

name := "Parser"

version := "1.0"

scalaVersion := "3.5.2"

libraryDependencies += "org.scala-lang.modules" %%% "scala-parser-combinators" % "2.1.1"

scalaJSUseMainModuleInitializer := false

scalaJSLinkerConfig ~= {
  _.withModuleKind(ModuleKind.ESModule)
    .withESFeatures(_.withESVersion(ESVersion.ES2018))
}

Compile / mainClass := Some("Main")

Compile / unmanagedSourceDirectories := Seq(baseDirectory.value / "src" / "main")
Test / unmanagedSourceDirectories := Seq(baseDirectory.value / "src" / "test")

Compile / fastLinkJS / scalaJSLinkerOutputDirectory := baseDirectory.value / "dist"
Compile / fullLinkJS / scalaJSLinkerOutputDirectory := baseDirectory.value / "dist"