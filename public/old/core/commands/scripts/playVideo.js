export default {
    R({ v: videoUrl }) {
        this.$lifecycle.notInit(() => {
            this.viewController.showVideo = true;
            let url64 = ''
            let index = 0
            if (videoUrl === './static/OP.mp4') {
                url64 = 'aHR0cHM6Ly93d3cuYmlsaWJpbGkuY29tL3ZpZGVvL0JWMU5mNHkxNDdKRA=='
            }
            if (videoUrl === './static/ED.mp4') {
                index = 1
                url64 = 'aHR0cHM6Ly93d3cuYmlsaWJpbGkuY29tL3ZpZGVvL0JWMUozNHkxWjdORQ=='
            }
            axios.get(`https://www.mxnzp.com/api/bilibili/video?url=${url64}&app_id=olndrim7sfgkqqui&app_secret=eFJ5VkxkZ29OUVJNdU9IQkROcTA4Zz09`)
                .then(res => {
                    videoUrl = res.data.data.list[index].url
                })
            // 等待元素渲染完成再操作
            // fix 此处有一定程度的延迟,容易不小心点过去
            // 目前采取独立一幕的方案
            // this.$lifecycle.notInit(() => {
            //     this.clickLock = true;
            //     this.state.bridge.pause()
            //     let fn = () => {
            //         this.clickLock = false;
            //         this.state.bridge.play()
            //         this.$refs.window.removeEventListener('click', fn)
            //     }
            //     this.$refs.window.addEventListener('click', fn)
            this.$nextTick(() => {
                this.$refs.video.src = videoUrl;
            });
        })
        // })
    },
}