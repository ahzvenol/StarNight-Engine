#version 300 es

precision mediump float;

in vec2 vTextureCoord;

out vec4 fragColor;

// uniforms
uniform vec4 outputFrame;
uniform vec4 inputSize;
uniform sampler2D uSampler; // 精灵纹理
uniform sampler2D uTexture; // 规则纹理
uniform float progress;      // 进度偏移
uniform float ramplen;       // ramp 步进
uniform bool reverse;        // 反转：黑先白后

void main(void) {
   vec4 color = texture(uSampler, vTextureCoord);

    // 精灵纹理UV坐标 * 精灵纹理尺寸 + 屏幕像素坐标 = 屏幕绝对像素坐标
   vec2 screenPos = vTextureCoord * inputSize.xy + outputFrame.xy;

    // 屏幕绝对像素坐标 / 规则纹理尺寸 = 屏幕坐标系下的规则纹理UV坐标
   vec2 screenCoord = screenPos / vec2(textureSize(uTexture, 0));

    // 使用红通道作为灰度值 (0=黑, 1=白)
   float rule = texture(uTexture,  screenCoord).r;

   rule = reverse ? 1.0f - rule : rule;

    // 将 ramp 归一化到 0-1 范围
   float ramp = max(ramplen, 1.0f) / 256.0f;

   float multiplier = 1.0f / ramp;

    // 根据 ramp 重新定义 offset 的滑动范围
    // progress=0 时, offset = -1.0
    // progress=1 时, offset = -1.0 + (1.0 + ramp) = ramp
   float offset = -1.0f + (1.0f + ramp) * progress;

    // 计算渐变因子
   float a = clamp((rule + offset) * multiplier, 0.0f, 1.0f);

   fragColor = mix(vec4(0.0f, 0.0f, 0.0f, 0.0f), color, a);
}
