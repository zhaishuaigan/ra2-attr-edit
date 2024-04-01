((w) => {
    w['配置'] = {
        加载: async (文件名) => {
            if (window[文件名]) {
                return ini.parse(window[文件名]);
            }

            await fetch('./assets/config/' + 文件名)
                .then(请求结果 => 请求结果.text())
                .then(配置内容 => {
                    window[文件名] = 配置内容;
                });
            return ini.parse(window[文件名]);
        }
    };
})(window);