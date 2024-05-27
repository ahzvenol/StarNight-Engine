// 记住要写type

const dic: any = {
    "name": "graphics",
    "width": 1280,
    "height": 720,
    "globalCss": "div{position: absolute;}",
    "children": [{
        type: "container",
        value: [undefined, { kind: "mutex", varName: "router" }],
        children: [
            {
                type: "element",
                style: { "kind": "css", value: "width: 100%;height: 100%;background-image: url(title_bg.png);" },
                children: [{
                    type: "container",
                    value: [{
                        kind: "clone", count: 4, args: {
                            a: ["0,1,2,3"],
                            img: [
                                `["http://imgsrc.baidu.com/super/pic/item/5d6034a85edf8db10565c2be4c23dd54574e74a5.jpg",
                                "http://imgsrc.baidu.com/super/pic/item/eac4b74543a98226e08b95fdcf82b9014b90eba6.jpg"],
                            ["http://imgsrc.baidu.com/super/pic/item/0df3d7ca7bcb0a46816935e32e63f6246a60afa5.jpg",
                                "http://imgsrc.baidu.com/super/pic/item/5bafa40f4bfbfbed881388a53df0f736aec31fa5.jpg"],
                            ["http://imgsrc.baidu.com/super/pic/item/bba1cd11728b47104e74431686cec3fdfd032395.jpg",
                                "http://imgsrc.baidu.com/super/pic/item/f2deb48f8c5494ee3469b1c368f5e0fe98257ea5.jpg"],
                            ["http://imgsrc.baidu.com/super/pic/item/f636afc379310a55997e602ef24543a983261095.jpg",
                                "http://imgsrc.baidu.com/super/pic/item/a5c27d1ed21b0ef41fa2268498c451da80cb3ea5.jpg"]`
                            ]
                        }
                    }],
                    children: [{
                        type: "element",
                        style: {
                            "kind": "css",
                            value: `width: 121px;height: 26px;right: 570px;bottom: {{a[i] * 41 + 55}}px;
                        background-image: url({{img[i][0]}});
                        &:hover{background-image: url({{img[i][1]}})}`
                        },
                        javaScript: [{ "kind": "js", lifecycle: "onclick", value: "this.varMap['router']({{a[i] * -1 + 3}})" }]
                    }]
                }]
            },
            {
                type: "element",
                style: {
                    "kind": "css", value: `width: 100%;height: 100%;
                        background-image: url(http://imgsrc.baidu.com/super/pic/item/91ef76c6a7efce1b20607610ea51f3deb58f65a5.jpg);` },
                children: [
                    {
                        type: "container",
                        value: [{
                            kind: "clone", count: 4, args: {
                                a: ["0,1,2,3"],
                            }
                        }],
                        children: [{
                            type: "element",
                            style: {
                                "kind": "css",
                                value: `width: 121px;height: 26px;right: 570px;bottom: px;
                        background-image: url({{}});
                        &:hover{background-image: url()}`
                            },
                            javaScript: [{ "kind": "js", lifecycle: "onclick", value: "this.varMap['router']()" }]
                        }]
                    },
                    {
                        type: "element",
                        style: {
                            "kind": "css",
                            value: `width: 88px;height: 39px;left: 110px;bottom: 625px;
                            background-image: url(http://imgsrc.baidu.com/super/pic/item/96dda144ad3459822cd15b4849f431adcaef8495.jpg);`
                        },
                    }
                ]
            }
        ]
    }]
}

export default dic


// const dic: any = {
//     "name": "graphics",
//     "width": 1280,
//     "height": 720,
//     "globalCss": "div{position: absolute;}",
//     "children": [{
//         type: "container",
//         value: [{ kind: "clone", count: 9, args: { "a": ["1,2,3", 3] } }],
//         children: [{
//             type: "element",
//             style: { "kind": "css", value: "width:150px;height:50px;top:{{a[i] * 200}}px;background-color: #bfa; &:hover{background-color: #999;}" },
//             javaScript: [
//                 { "kind": "js", lifecycle: "onclick", value: "console.log(2);this.functionMap.setVar('a')(e => e-1)" },
//                 {
//                     "kind": "js", lifecycle: "onMount",
//                     value: "this.functionMap.setVar = (str) => (f) => this.varMap[str](f(this.varMap[str]()))"
//                 }
//             ],
//             createVar: { "kind": "var", value: { a: 10 } },
//             when: { "kind": "show", value: [{ var: "a", operator: ">=", condition: 0 }] },
//             children: [{
//                 type: "element",
//                 style: { "kind": "css", value: "width:50px;height:150px;background-color: #bfa;" },
//                 javaScript: [{ "kind": "js", lifecycle: "onclick", value: "console.log(1);this.functionMap.setVar('a')(e => e+1)" }],
//                 when: { "kind": "show", value: [{ var: "a", operator: "<=", condition: 5 }] },
//                 children: []
//             }]
//         }]
//     }]
// }