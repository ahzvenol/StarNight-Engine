#version 300 es

in vec2 aVertexPosition;
in vec2 aTextureCoord;

uniform mat3 projectionMatrix;

out vec2 vTextureCoord;

void main(void) {
   vTextureCoord = aTextureCoord;

   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0f)).xy, 0.0f, 1.0f);
}