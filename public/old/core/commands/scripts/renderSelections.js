export default {
    R({ t: selections }) {
        this.$lifecycle.notInit(() => {
            let temp = [];
            for (let key in selections) {
                let obj = {
                    content: key,
                    callback: () => {
                        // 如果这里选择跳转重开,则不会保留运行数据,暂时不采用这个做法
                        this.rowIndex = selections[key];
                        this.selections = [];
                    },
                };
                temp.push(obj);
            }
            this.selections = temp;
        })
        // test:这个应该多余
        // this.viewController.showSelections = true;
    },
}