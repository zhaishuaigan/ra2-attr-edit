(function () {
    window.地图 = function () {
        return {
            rules: {},
            csf: {},
            art: {},
            初始化: async function () {
                this.rules = await this.loadRules();
                this.csf = await this.loadCsf();
                // this.art = await this.loadArt();
                this.解析所有名字();
                this.追加弹头到武器下面();
                this.追加抛射体到武器下面();
                this.追加武器属性到单位下面();
            },
            合并地图: function (地图配置) {
                // this.rules = 地图配置;
                for (var i in 地图配置) {
                    if (!this.rules[i]) {
                        this.rules[i] = {};
                    }
                    for (var j in 地图配置[i]) {
                        this.rules[i][j] = 地图配置[i][j];
                    }
                }
                this.解析所有名字();
                this.追加弹头到武器下面();
                this.追加抛射体到武器下面();
                this.追加武器属性到单位下面();

            },

            loadArt: async function () {
                return await 配置.加载('artmd.ini');
            },

            loadCsf: async function () {
                return (await 配置.加载('csfcn.ini'))['csf'];
            },
            合并中文翻译: function (翻译) {
                for (var i in 翻译) {
                    this.csf[i.toLowerCase()] = 翻译[i];
                }
                this.解析所有名字();
            },
            loadRules: async function () {
                return await 配置.加载('rulesmd.ini');
            },
            解析所有名字: function () {
                for (var i in this.rules) {
                    var name = this.rules[i]['UIName']?.toLowerCase();

                    if (name && this.csf[name]) {
                        this.rules[i]['UIName2'] = this.csf[name];
                    }
                }
            },
            追加武器属性到单位下面: function () {
                for (var i in this.rules) {
                    var Primary = this.rules[i]['Primary'] ? this.rules[i]['Primary'] : '';
                    if (Primary && this.rules[Primary]) {
                        this.rules[i]['Primary2'] = this.rules[Primary];
                    }

                    var ElitePrimary = this.rules[i]['ElitePrimary'] ? this.rules[i]['ElitePrimary'] : '';
                    if (ElitePrimary && this.rules[ElitePrimary]) {
                        this.rules[i]['ElitePrimary2'] = this.rules[ElitePrimary];
                    }

                    var Secondary = this.rules[i]['Secondary'] ? this.rules[i]['Secondary'] : '';
                    if (Secondary && this.rules[Secondary]) {
                        this.rules[i]['Secondary2'] = this.rules[Secondary];
                    }

                    var EliteSecondary = this.rules[i]['EliteSecondary'] ? this.rules[i]['EliteSecondary'] : '';
                    if (EliteSecondary && this.rules[EliteSecondary]) {
                        this.rules[i]['EliteSecondary2'] = this.rules[EliteSecondary];
                    }

                }
            },
            追加弹头到武器下面: function () {
                for (var i in this.rules) {
                    var key = this.rules[i]['Warhead'] ? this.rules[i]['Warhead'] : '';
                    if (key && this.rules[key]) {
                        this.rules[i]['Warhead2'] = this.rules[key];
                    }
                }
            },
            追加抛射体到武器下面: function () {
                for (var i in this.rules) {
                    var key = this.rules[i]['Projectile'] ? this.rules[i]['Projectile'] : '';
                    if (key && this.rules[key]) {
                        this.rules[i]['Projectile2'] = this.rules[key];
                    }
                }
            },
            获取所有建筑: function () {
                var list = Object.values(this.rules['BuildingTypes']);
                var result = {};
                for (var i in list) {
                    result[list[i]] = this.rules[list[i]];
                }
                return result;
            },
            获取可建造的建筑: function () {
                var 所有建筑 = this.获取所有建筑();
                var result = {};
                var tech = -1;
                for (var i in 所有建筑) {
                    tech = 所有建筑[i]?.TechLevel;
                    if (tech >= 0 && tech <= 10) {
                        result[i] = 所有建筑[i];
                    }

                }
                return result;
            },
            获取所有防御建筑: function () {
                var 所有建筑 = this.获取所有建筑();
                var result = {};
                var 建筑类型 = '';
                for (var i in 所有建筑) {
                    建筑类型 = 所有建筑[i]?.BuildCat;
                    if (建筑类型 && 建筑类型 === 'Combat') {
                        result[i] = 所有建筑[i];
                    }

                }
                return result;
            },

            获取所有士兵: function () {
                var list = Object.values(this.rules['InfantryTypes']);
                var result = {};
                for (var i in list) {
                    result[list[i]] = this.rules[list[i]];
                }
                return result;
            },

            获取可训练的士兵: function () {
                var 所有士兵 = this.获取所有士兵();
                var result = {};
                var tech = -1;
                for (var i in 所有士兵) {
                    tech = 所有士兵[i]?.TechLevel;
                    if (tech >= 0 && tech <= 10) {
                        result[i] = 所有士兵[i];
                    }
                }
                return result;
            },

            获取所有战车或飞机: function () {
                var list = [...Object.values(this.rules['VehicleTypes']), ...Object.values(this.rules['AircraftTypes'])];
                var result = {};
                for (var i in list) {
                    result[list[i]] = this.rules[list[i]];
                }
                return result;
            },
            获取可训练的战车或飞机: function () {
                var 所有战车或飞机 = this.获取所有战车或飞机();
                var result = {};
                var tech = -1;
                for (var i in 所有战车或飞机) {
                    tech = 所有战车或飞机[i]?.TechLevel;
                    if (tech >= 0 && tech <= 10) {
                        result[i] = 所有战车或飞机[i];
                    }

                }
                return result;
            }

        }
    }
})();