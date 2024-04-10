(async function () {
    var 原始地图数据 = 地图();
    await 原始地图数据.初始化();
    var 合并后的数据 = 地图();
    await 合并后的数据.初始化();
    var 属性翻译 = await 配置.加载('attr.ini');

    var 修改过的注册名 = {};
    var 地图文件 = null;
    var 地图数据 = null;
    var 地图内容 = '';

    function 保存地图() {
        if (!地图文件) {
            ElementPlus.ElNotification({
                title: '提示',
                message: '你还没有选择地图文件',
                type: 'info',
                duration: 3000,
            })
            return;
        }

        for (var i in 修改过的注册名) {
            var 新单位数据 = {}
            新单位数据[i] = 地图数据[i];
            var 新单位内容 = ini.stringify(新单位数据);

            if (地图内容.indexOf('[' + i + ']') === -1) {
                // 新增的单位
                地图内容 += '\n\n' + 新单位内容;
            } else {
                // 修改单位
                地图内容 = 地图内容.replace(new RegExp('\\[' + i + '\\][\\s\\S]*?([\\[]|$)'), 新单位内容 + '\n$1');
            }
        }

        // 将utf8编码字符串转换成gb2312编码字符串
        var 编码后的内容 = encodeGBK(地图内容);
        地图文件.createWritable()
            .then(function (写入文件) {
                写入文件.write(编码后的内容).then(function () {
                    写入文件.close();
                    ElementPlus.ElNotification({
                        title: '提示',
                        message: '文件保存成功',
                        type: 'success',
                        duration: 3000,
                    })
                });
                修改过的注册名 = {};
            });
    }

    // Ctrl+s 保存地图
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            保存地图();
        }
    });

    window.app = Vue.createApp({
        el: '#app',
        data: function () {
            return {
                建筑列表: {},
                士兵列表: {},
                战车或飞机列表: {},
                合并后的数据: 合并后的数据,
                选择的地图: {},
                文件名: '',
                编辑属性对话框: false,
                要编辑的单位: {
                    注册名: '',
                    属性名: '',
                    属性值: ''
                },
                添加属性对话框: false,
                要添加的属性: {
                    注册名: '',
                    属性名: '',
                    属性值: ''
                },
                生成建筑盲盒对话框: false,
                生成建筑盲盒的数据: {
                    注册名: '',
                    模板: '[{注册名}{编号}]\nUIName={显示名}\nName={注册名}\nDeploysInto={注册名}\nGroupAs={注册名}\nCost=1000\nSize=6\nArmor=light\nImage=TRUCKB\nOwner=British,French,Germans,Americans,Alliance,Russians,Confederation,Africans,Arabs,YuriCountry\nSight=5\nSpeed=4\nCrewed=no\nPoints=40\nTurret=no\nWeight=2\nCrusher=no\nPrimary=none\nSoylent=100\nCategory=AFV\nDieSound=GenVehicleDie\nStrength=200\nExplosion=TWLT070,S_BANG48,S_BRNL58,S_CLSN58,S_TUMU60\nLocomotor={4A582741-9839-11d1-B709-00A024DDAFD1}\nMaxDebris=2\nSecondary=none\nTechLevel=-1\nTrainable=no\nVoiceMove=\nCrushSound=TankCrush\nCrateGoodie=yes\nDebrisTypes=TIRE\nSelfHealing=no\nThreatPosed=50\nVoiceAttack=GenAllVehicleAttackCommand\nVoiceSelect=GenAllVehicleSelect\nCarriesCrate=yes\nMovementZone=Normal\nInsignificant=no\nVoiceFeedback=\nDebrisMaximums=4\nDamageParticleSystems=SparkSys,SmallGreySSys\nAllowedToStartInMultiplayer=no',
                    生成数量: 10,
                    开始编号: 200,
                    生成结果: '',
                },
                生成战车盲盒对话框: false,
                生成战车盲盒的数据: {
                    注册名: '',
                    生成数量: 10,
                    开始编号: 200,
                    生成结果: '',
                },
                盲盒生成器对话框: false,
                盲盒生成器的数据: {
                    模板: '[{注册名}{编号}]\nUIName={显示名}\nName={注册名}\nDeploysInto={注册名}\nGroupAs={注册名}\nCost=1000\nSize=6\nArmor=light\nImage=TRUCKB\nOwner=British,French,Germans,Americans,Alliance,Russians,Confederation,Africans,Arabs,YuriCountry\nSight=5\nSpeed=4\nCrewed=no\nPoints=40\nTurret=no\nWeight=2\nCrusher=no\nPrimary=none\nSoylent=100\nCategory=AFV\nDieSound=GenVehicleDie\nStrength=200\nExplosion=TWLT070,S_BANG48,S_BRNL58,S_CLSN58,S_TUMU60\nLocomotor={4A582741-9839-11d1-B709-00A024DDAFD1}\nMaxDebris=2\nSecondary=none\nTechLevel=-1\nTrainable=no\nVoiceMove=\nCrushSound=TankCrush\nCrateGoodie=yes\nDebrisTypes=TIRE\nSelfHealing=no\nThreatPosed=50\nVoiceAttack=GenAllVehicleAttackCommand\nVoiceSelect=GenAllVehicleSelect\nCarriesCrate=yes\nMovementZone=Normal\nInsignificant=no\nVoiceFeedback=\nDebrisMaximums=4\nDamageParticleSystems=SparkSys,SmallGreySSys\nAllowedToStartInMultiplayer=no',
                    开始编号: 200,
                    已有配置: '',
                    建筑: {},
                    战车: {},
                    生成结果: '',
                },
                复制单位对话框: false,
                复制单位的数据: {
                    选中的注册名: '',
                    新注册名: '',
                    注册类型: '',
                    编号: 0,
                },
                选中的单位: null,
                选中的注册名: '',
                rules: 原始地图数据.rules,
                csf: 原始地图数据.csf,
                art: 原始地图数据.art,
                current: '建筑',
                types: ['建筑', '士兵', '战车或飞机'],
                search: '',
                要展示的数据: {},
                selectedData: {},
                打开单位详情页面: false,
                drawer: false,
                drawerSize: "50%",
                activeName: 'attr',
                激活选项卡: 'attr',
            }
        },
        computed: {
            新建筑: function () {
                if (!this.选择的地图 || !this.选择的地图["BuildingTypes"]) {
                    return {};
                }
                var 返回结果 = {};
                var 新建筑 = Object.values(this.选择的地图["BuildingTypes"]);
                for (var i = 0; i < 新建筑.length; i++) {
                    返回结果[新建筑[i]] = 合并后的数据.rules[新建筑[i]];
                }
                return 返回结果;
            },
            新士兵: function () {
                if (!this.选择的地图 || !this.选择的地图["InfantryTypes"]) {
                    return {};
                }
                var 返回结果 = {};
                var 新士兵 = Object.values(this.选择的地图["InfantryTypes"]);
                for (var i = 0; i < 新士兵.length; i++) {
                    返回结果[新士兵[i]] = 合并后的数据.rules[新士兵[i]];
                }
                return 返回结果;
            },
            新战车或飞机: function () {
                if (!this.选择的地图 || !this.选择的地图["VehicleTypes"]) {
                    return {};
                }
                var 返回结果 = {};
                var 新战车或飞机 = Object.values(this.选择的地图["VehicleTypes"]);
                for (var i = 0; i < 新战车或飞机.length; i++) {
                    返回结果[新战车或飞机[i]] = 合并后的数据.rules[新战车或飞机[i]];
                }
                return 返回结果;
            },
            新属性: function () {
                if (!this.要展示的数据) {
                    return {};
                }
                var 返回结果 = {};
                if (!this.选择的地图[this.选中的注册名]) {
                    // 选择的单位没有在地图里面定义, 则没有新属性
                    return {};
                }
                if (!this.rules[this.选中的注册名]) {
                    // 选择的单位不是新定义的, 则没有新属性
                    return {};
                }
                for (var i in this.选择的地图[this.选中的注册名]) {
                    // 如果属性在原始地图数据里面没有定义, 则是新属性
                    if (typeof 原始地图数据.rules[this.选中的注册名][i] === 'undefined') {
                        返回结果[i] = this.选择的地图[this.选中的注册名][i];
                    }
                }
                return 返回结果;
            },
        },
        created: function () {
            this.刷新所有类型();
            document.getElementById('loading').style.display = 'none';
            document.getElementById('app').style.display = 'block';
            // 如果是手机端，把抽屉的宽度设置为100%
            if (document.body.clientWidth < 500) {
                this.drawerSize = "100%";
            }

            // this.获取所有武器();
            // this.获取所有建筑的显示名();

            // 从本地缓存读取模板
            var 模板 = localStorage.getItem('建筑盲盒的模板');
            if (模板) {
                this.生成建筑盲盒的数据.模板 = 模板;
            }
            this.添加页面关闭事件();

        },
        methods: {
            更新检测: async function () {
                const 加载框 = ElementPlus.ElLoading.service({
                    lock: true,
                    text: '正在检测更新, 请稍等...',
                    background: 'rgba(0, 0, 0, 0.7)',
                })
                var t = new Date().getTime();
                var 新版本号 = await fetch('https://raw.githubusercontent.com/zhaishuaigan/ra2-attr-edit/main/dist/version.txt?t=' + t)
                新版本号 = await 新版本号.text();
                console.log('新版本号:', 新版本号, '当前版本号:', window.version);
                if (新版本号 == window.version) {
                    加载框.close();
                    ElementPlus.ElMessage({
                        message: '恭喜, 当前已经是最新版本了!',
                        type: 'success',
                    })
                    return;
                }
                var 更新地址 = 'https://raw.githubusercontent.com/zhaishuaigan/ra2-attr-edit/main/dist/%E7%BA%A2%E8%AD%A6%E5%9C%B0%E5%9B%BE%E5%8D%95%E4%BD%8D%E5%B1%9E%E6%80%A7%E6%9F%A5%E7%9C%8B%E5%99%A8.html?t=' + t;
                var 新文件代码 = await fetch(更新地址);
                新文件代码 = await 新文件代码.text();
                加载框.close();
                var 用户响应 = await ElementPlus.ElMessageBox.confirm(
                    '检测到新版本, 是否立即下载?',
                    'Warning',
                    {
                        confirmButtonText: '立即下载',
                        cancelButtonText: '取消, 我还是先用旧版本吧',
                        type: 'warning',
                    }
                ).catch(() => { });
                if (用户响应 !== 'confirm') {
                    return;
                }
                this.将文本保存成本地文件(新文件代码, '红警地图单位属性查看器.html');
            },
            添加页面关闭事件: function () {
                window.addEventListener('beforeunload', function (e) {
                    if (Object.keys(修改过的注册名).length > 0) {
                        e.preventDefault();
                        // 提示用户保存地图
                        ElementPlus.ElMessageBox.confirm('你有未保存的修改, 是否保存?', '提示', {
                            confirmButtonText: '保存',
                            cancelButtonText: '不保存',
                            type: 'warning',
                        }).then(() => {
                            保存地图();
                        });
                    }
                });

            },
            翻译属性: function (属性名) {
                for (var 类型 in 属性翻译) {
                    for (var 属性 in 属性翻译[类型]) {
                        if (属性.toLowerCase() == 属性名.toLowerCase()) {
                            return 属性翻译[类型][属性];
                        }
                    }
                }
                return '暂无翻译';
            },
            打开复制单位对话框: function (注册名, 注册类型) {
                if (!地图文件) {
                    ElementPlus.ElNotification({
                        title: '提示',
                        message: '你还没有选择地图文件, 无法使用添加属性功能!',
                        type: 'info',
                        duration: 3000,
                    })
                    return;
                }
                this.复制单位对话框 = true;
                this.复制单位的数据.选中的注册名 = 注册名;
                this.复制单位的数据.新注册名 = 注册名;
                this.复制单位的数据.注册类型 = 注册类型;

                // 根据类型自动计算编号
                switch (注册类型) {
                    case '建筑':
                        var 最大编号 = Object.keys(合并后的数据.rules['BuildingTypes']).map(Number).reduce((a, b) => Math.max(a, b), 0);
                        this.复制单位的数据.编号 = 最大编号 + 1;
                        break;
                    case '士兵':
                        var 最大编号 = Object.keys(合并后的数据.rules['InfantryTypes']).map(Number).reduce((a, b) => Math.max(a, b), 0);
                        this.复制单位的数据.编号 = 最大编号 + 1;
                        break;
                    case '战车或飞机':
                        var 最大编号 = Object.keys(合并后的数据.rules['VehicleTypes']).map(Number).reduce((a, b) => Math.max(a, b), 0);
                        this.复制单位的数据.编号 = 最大编号 + 1;
                        break;
                    default:
                        this.复制单位的数据.编号 = 0;
                        break;
                }
            },
            复制单位: async function () {
                if (合并后的数据.rules[this.复制单位的数据.新注册名]) {
                    ElementPlus.ElNotification({
                        title: '提示',
                        message: '注册名已经存在请重新输入',
                        type: 'error',
                        duration: 3000,
                    })
                    return;
                }
                var 新单位 = JSON.parse(JSON.stringify(合并后的数据.rules[this.复制单位的数据.选中的注册名]));

                合并后的数据.rules[this.复制单位的数据.新注册名] = JSON.parse(JSON.stringify(新单位));
                地图数据[this.复制单位的数据.新注册名] = JSON.parse(JSON.stringify(新单位));
                switch (this.复制单位的数据.注册类型) {
                    case '建筑':
                        合并后的数据.rules['BuildingTypes'][this.复制单位的数据.编号] = this.复制单位的数据.新注册名;
                        地图数据['BuildingTypes'][this.复制单位的数据.编号] = this.复制单位的数据.新注册名;
                        修改过的注册名['BuildingTypes'] = true;
                        break;
                    case '士兵':
                        合并后的数据.rules['InfantryTypes'][this.复制单位的数据.编号] = this.复制单位的数据.新注册名;
                        地图数据['InfantryTypes'][this.复制单位的数据.编号] = this.复制单位的数据.新注册名;
                        修改过的注册名['InfantryTypes'] = true;
                        break;
                    case '战车或飞机':
                        合并后的数据.rules['VehicleTypes'][this.复制单位的数据.编号] = this.复制单位的数据.新注册名;
                        地图数据['VehicleTypes'][this.复制单位的数据.编号] = this.复制单位的数据.新注册名;
                        修改过的注册名['VehicleTypes'] = true;
                        break;
                    default:
                        break;
                }
                await 合并后的数据.合并地图({});
                if (this.打开单位详情页面) {
                    this.显示详情(合并后的数据.rules[this.复制单位的数据.新注册名], this.复制单位的数据.新注册名);
                }
                地图数据[this.复制单位的数据.新注册名] = JSON.parse(JSON.stringify(新单位));
                修改过的注册名[this.复制单位的数据.新注册名] = true;
                this.复制单位对话框 = false;
                this.刷新所有类型();
            },
            获取所有建筑的显示名: function () {
                var 所有建筑 = {};
                var 所有建筑列表 = Object.values(合并后的数据.rules['BuildingTypes']);
                for (var 单位注册名 of 所有建筑列表) {
                    var 单位 = 合并后的数据.rules[单位注册名];
                    if (单位 && 单位.UIName) {
                        所有建筑[单位注册名] = 单位.UIName;
                    } else {
                        所有建筑[单位注册名] = 'Name:' + 单位注册名;
                    }
                }
                return 所有建筑;
            },
            打开建筑盲盒生成器: function (注册名) {
                this.生成建筑盲盒对话框 = true;
                this.生成建筑盲盒的数据.注册名 = 注册名;
                this.生成建筑盲盒的数据.生成结果 = '';
            },
            根据参数生成建筑盲盒数据: function () {
                var 参数 = this.生成建筑盲盒的数据;
                var 所有显示名 = this.获取所有建筑的显示名();
                var 注册表 = {};
                注册表['VehicleTypes'] = {};
                新单位数据 = '';
                var 模板 = 参数.模板;
                var 结束编号 = parseInt(参数.开始编号) + parseInt(参数.生成数量);
                for (var i = 参数.开始编号; i < 结束编号; i++) {
                    var 新注册名 = 参数.注册名 + i;
                    注册表['VehicleTypes'][i] = 新注册名;
                    新单位数据 += 模板.replace(/\{注册名\}/g, 参数.注册名)
                        .replace(/\{显示名\}/g, 所有显示名[参数.注册名])
                        .replace('{编号}', i) + '\n\n';
                }

                生成结果 = ini.stringify(注册表) + '\n\n' + 新单位数据;
                this.生成建筑盲盒的数据.生成结果 = 生成结果;
                this.生成战车盲盒的数据.开始编号 = 结束编号;
                this.生成建筑盲盒的数据.开始编号 = 结束编号;
                // 缓存模板写入本地缓存
                localStorage.setItem('建筑盲盒的模板', this.生成建筑盲盒的数据.模板);

            },
            打开战车盲盒生成器: function (注册名) {
                this.生成战车盲盒对话框 = true;
                this.生成战车盲盒的数据.注册名 = 注册名;
                this.生成战车盲盒的数据.生成结果 = '';
            },
            根据参数生成战车盲盒数据: function () {
                var 参数 = this.生成战车盲盒的数据;
                // 完全复制选中的战车, 然后修改模型
                var 单位 = JSON.parse(JSON.stringify(合并后的数据.rules[参数.注册名]));
                单位.GroupAs = 参数.注册名;
                单位.CrateGoodie = 'yes';
                delete 单位.UIName2;
                for (var i in 单位) {
                    if (typeof 单位[i] != 'string') {
                        delete 单位[i];
                    }
                }
                var 注册表 = {};
                注册表['VehicleTypes'] = {};
                var 新单位列表 = {};
                var 生成结果 = '';
                var 结束编号 = parseInt(参数.开始编号) + parseInt(参数.生成数量);
                for (var i = 参数.开始编号; i < 结束编号; i++) {
                    var 新注册名 = 参数.注册名 + i;
                    注册表['VehicleTypes'][i] = 新注册名;
                    新单位列表[新注册名] = JSON.parse(JSON.stringify(单位));
                }
                生成结果 = ini.stringify(注册表) + '\n\n' + ini.stringify(新单位列表);
                this.生成战车盲盒的数据.生成结果 = 生成结果;
                this.生成战车盲盒的数据.开始编号 = 结束编号;
                this.生成建筑盲盒的数据.开始编号 = 结束编号;

            },

            加入盲盒生成器: async function (注册名) {
                await this.保存添加的属性({
                    注册名: 注册名,
                    属性名: 'manghe',
                    属性值: '1',
                });
                ElementPlus.ElNotification({
                    title: '提示',
                    message: '加入盲盒生成器成功',
                    type: 'success',
                    duration: 3000,
                })

            },
            从盲盒生成器中删除: async function (注册名) {
                await this.直接删除属性不提示(注册名, 'manghe');
            },
            打开盲盒生成器: function () {
                if (typeof 合并后的数据.rules['manghe'] !== 'undefined') {
                    this.盲盒生成器的数据.模板 = JSON.parse(合并后的数据.rules['manghe']['tpl']);
                    this.盲盒生成器的数据.开始编号 = 合并后的数据.rules['manghe']['start'];
                }
                this.计算盲盒生成器的数据();
                this.盲盒生成器对话框 = true;
            },
            计算盲盒生成器的数据: function () {
                var 所有要生成盲盒的建筑 = {};
                var 所有要生成盲盒的战车 = {};
                this.盲盒生成器的数据.已有配置 = '';
                var 所有建筑 = Object.values(合并后的数据.rules["BuildingTypes"]);
                for (var i = 0; i < 所有建筑.length; i++) {
                    var 注册名 = 所有建筑[i];
                    if (typeof 合并后的数据.rules[注册名] == 'undefined') {
                        continue;
                    }

                    if (typeof 合并后的数据.rules[注册名]['manghe'] != 'undefined') {
                        所有要生成盲盒的建筑[注册名] = 合并后的数据.rules[注册名];
                        this.盲盒生成器的数据.已有配置 += 注册名 + '=' + 合并后的数据.rules[注册名]['manghe'] + ';' + 合并后的数据.rules[注册名]['UIName2'] + '\n';
                    }
                }

                var 所有战车 = Object.values(合并后的数据.rules["VehicleTypes"]);
                for (var i = 0; i < 所有战车.length; i++) {
                    var 注册名 = 所有战车[i];
                    if (typeof 合并后的数据.rules[注册名] == 'undefined') {
                        continue;
                    }
                    if (typeof 合并后的数据.rules[注册名]['manghe'] != 'undefined') {
                        所有要生成盲盒的战车[注册名] = 合并后的数据.rules[注册名];
                        this.盲盒生成器的数据.已有配置 += 注册名 + '=' + 合并后的数据.rules[注册名]['manghe'] + ';' + 合并后的数据.rules[注册名]['UIName2'] + '\n';
                    }
                }
                this.盲盒生成器的数据.生成结果 = '';
                this.盲盒生成器的数据.建筑 = 所有要生成盲盒的建筑;
                this.盲盒生成器的数据.战车 = 所有要生成盲盒的战车;
            },
            生成盲盒数据: async function () {
                var 开始编号 = parseInt(this.盲盒生成器的数据.开始编号);
                var 模板 = this.盲盒生成器的数据.模板;
                var 修改后的数据 = ini.parse('[盲盒]\n' + this.盲盒生成器的数据.已有配置);
                for (var 注册名 in 修改后的数据['盲盒']) {
                    if (修改后的数据['盲盒'][注册名] != 合并后的数据.rules[注册名]['manghe']) {
                        await this.保存属性({
                            注册名: 注册名,
                            属性名: 'manghe',
                            属性值: 修改后的数据['盲盒'][注册名],
                        });
                    }
                }

                for (var 注册名 in this.盲盒生成器的数据.建筑) {
                    if (typeof 修改后的数据['盲盒'][注册名] == 'undefined') {
                        await this.直接删除属性不提示(注册名, 'manghe');
                    }
                }

                for (var 注册名 in this.盲盒生成器的数据.战车) {
                    if (typeof 修改后的数据['盲盒'][注册名] == 'undefined') {
                        await this.直接删除属性不提示(注册名, 'manghe');
                    }
                }
                this.计算盲盒生成器的数据();
                var 所有显示名 = this.获取所有建筑的显示名();
                var 开始编号 = parseInt(this.盲盒生成器的数据.开始编号);
                var 模板 = this.盲盒生成器的数据.模板;
                var 生成结果 = '';
                var 注册表 = {};
                注册表['VehicleTypes'] = {};
                for (var i in this.盲盒生成器的数据.建筑) {
                    var 注册名 = i;
                    var 数量 = parseInt(this.盲盒生成器的数据.建筑[i]['manghe']);
                    var 结束编号 = 开始编号 + 数量;
                    for (var j = 开始编号; j < 结束编号; j++) {
                        注册表['VehicleTypes'][开始编号] = 注册名 + 开始编号;
                        生成结果 += 模板.replace(/\{注册名\}/g, i)
                            .replace(/\{显示名\}/g, 所有显示名[注册名])
                            .replace('{编号}', 开始编号) + '\n\n';
                        开始编号++;
                    }
                }
                for (var i in this.盲盒生成器的数据.战车) {
                    var 注册名 = i;
                    var 数量 = parseInt(this.盲盒生成器的数据.战车[注册名]['manghe']);
                    var 结束编号 = 开始编号 + 数量;
                    var 单位 = JSON.parse(JSON.stringify(合并后的数据.rules[注册名]));
                    单位.GroupAs = i;
                    单位.CrateGoodie = 'yes';
                    if (typeof 单位.Image === 'undefined') {
                        单位.Image = 注册名;
                    }
                    delete 单位.UIName2;
                    for (var j in 单位) {
                        if (typeof 单位[j] != 'string') {
                            delete 单位[j];
                        }
                    }

                    for (var j = 开始编号; j < 结束编号; j++) {
                        注册表['VehicleTypes'][开始编号] = 注册名 + 开始编号;
                        var 新单位 = {};
                        新单位[注册名 + 开始编号] = 单位;
                        生成结果 += ini.stringify(新单位) + '\n\n';
                        开始编号++;
                    }
                }
                this.盲盒生成器的数据.生成结果 = ini.stringify(注册表) + '\n\n' + 生成结果;
                this.保存属性({
                    注册名: 'manghe',
                    属性名: 'tpl',
                    属性值: JSON.stringify(this.盲盒生成器的数据.模板),
                });
                this.保存属性({
                    注册名: 'manghe',
                    属性名: 'start',
                    属性值: this.盲盒生成器的数据.开始编号,
                });
                ElementPlus.ElNotification({
                    title: '提示',
                    message: '生成盲盒数据成功',
                    type: 'success',
                });
            },

            将文本保存成本地文件: function (文本, 文件名) {
                // 使用web file system api保存文件
                window.showSaveFilePicker({
                    suggestedName: 文件名
                }).then(function (fileHandle) {
                    fileHandle.createWritable().then(function (fileWritable) {
                        const encoder = new TextEncoder();
                        const data = encoder.encode(文本);
                        fileWritable.write(data);
                        fileWritable.close();
                    });
                });
            },
            获取所有武器: function () {
                // 正式环境不需要这个功能
                return;
                var 所有武器 = {};
                var 所有武器的弹头 = {};
                var 所有武器的抛射体 = {};
                for (var 单位注册名 in this.rules) {
                    var 单位 = this.rules[单位注册名];
                    if (单位.ElitePrimary) {
                        所有武器[单位.ElitePrimary] = 单位.UIName2 + ' 升级后的主武器';
                        所有武器的弹头[单位.ElitePrimary2?.Warhead] = 单位.UIName2 + ' 升级后的主武器弹头';
                        所有武器的抛射体[单位.ElitePrimary2?.Projectile] = 单位.UIName2 + ' 升级后的主武器抛射体';
                    }
                    if (单位.EliteSecondary) {
                        所有武器[单位.EliteSecondary] = 单位.UIName2 + ' 升级后的副武器';
                        所有武器的弹头[单位.EliteSecondary2?.Warhead] = 单位.UIName2 + ' 升级后的副武器弹头';
                        所有武器的抛射体[单位.EliteSecondary2?.Projectile] = 单位.UIName2 + ' 升级后的副武器抛射体';
                    }
                    if (单位.Primary) {
                        所有武器[单位.Primary] = 单位.UIName2 + ' 的主武器';
                        所有武器的弹头[单位.Primary2?.Warhead] = 单位.UIName2 + ' 的主武器弹头';
                        所有武器的抛射体[单位.Primary2?.Projectile] = 单位.UIName2 + ' 的主武器抛射体';
                    }
                    if (单位.Secondary) {
                        所有武器[单位.Secondary] = 单位.UIName2 + ' 的副武器';
                        所有武器的弹头[单位.Secondary2?.Warhead] = 单位.UIName2 + ' 的副武器弹头';
                        所有武器的抛射体[单位.Secondary2?.Projectile] = 单位.UIName2 + ' 的副武器抛射体';
                    }

                }
                var 输出所有武器 = '';
                for (var 武器名 in 所有武器) {
                    输出所有武器 += 武器名 + '=' + 所有武器[武器名] + '\n';
                }
                // console.log(输出所有武器);

                var 输出所有弹头 = '';
                for (var 弹头名 in 所有武器的弹头) {
                    输出所有弹头 += 弹头名 + '=' + 所有武器的弹头[弹头名] + '\n';
                }
                // console.log(输出所有弹头);

                var 输出所有抛射体 = '';
                for (var 抛射体名 in 所有武器的抛射体) {
                    输出所有抛射体 += 抛射体名 + '=' + 所有武器的抛射体[抛射体名] + '\n';
                }
                console.log(输出所有抛射体);
            },
            搜索属性名: function (搜索词, 回调函数) {
                (async () => {
                    var 提示数据 = await 配置.加载('attr.ini');
                    var 所有提示词 = [];
                    for (var 类型 in 提示数据) {
                        for (var 属性 in 提示数据[类型]) {
                            所有提示词.push({
                                value: 属性,
                                zh: 提示数据[类型][属性] + ' - ' + 类型,
                            });
                        }
                    }
                    if (搜索词 === '') {
                        回调函数(所有提示词);
                        return;
                    }
                    var 返回结果 = [];
                    for (var 属性 of 所有提示词) {
                        if (属性.value.toLowerCase().includes(搜索词.toLowerCase())) {
                            返回结果.push(属性);
                        } else if (属性.zh.toLowerCase().includes(搜索词.toLowerCase())) {
                            返回结果.push(属性);
                        }
                    }
                    回调函数(返回结果);
                })();
            },
            搜索属性值: function (搜索词, 回调函数) {
                (async () => {
                    var 提示数据 = await 配置.加载('value.ini');
                    var 所有提示词 = [];
                    var 提示类型 = '';
                    var 返回结果 = [];
                    for (var 类型 in 提示数据) {
                        for (var 属性 in 提示数据[类型]) {
                            if (属性.toLowerCase() == 搜索词.toLowerCase()) {
                                提示类型 = 类型;
                                break;
                            }
                            所有提示词.push({
                                value: 属性,
                                zh: 提示数据[类型][属性],
                            });
                        }
                    }
                    if (搜索词 === '') {
                        回调函数(所有提示词);
                        return;
                    }
                    if (提示类型) {
                        for (var 属性 in 提示数据[提示类型]) {
                            返回结果.push({
                                value: 属性,
                                zh: 提示数据[提示类型][属性],
                            });
                        }
                    } else {
                        for (var 属性 of 所有提示词) {
                            if (属性.value.toLowerCase().includes(搜索词.toLowerCase())) {
                                返回结果.push(属性);
                            } else if (属性.zh.toLowerCase().includes(搜索词.toLowerCase())) {
                                返回结果.push(属性);
                            }
                        }
                    }
                    回调函数(返回结果);
                })();
            },
            获取单位名字: function (单位) {
                if (typeof 单位 === 'string') {
                    单位 = 合并后的数据.rules[单位];
                }
                if (!单位) {
                    return "";
                }
                if (typeof 单位.UIName2 === 'string' && 单位.UIName2 !== "") {
                    return 单位.UIName2;
                }
                if (typeof 单位.UIName === 'string' && 单位.UIName !== "") {
                    return 单位.UIName;
                }
                if (typeof 单位.Name === 'string' && 单位.Name !== "") {
                    return 单位.Name;
                }
                return "";
            },
            获取属性状态: function (单位, 属性) {
                if (!this.rules[单位] || typeof 原始地图数据.rules[单位][属性] == 'undefined') {
                    return "新增";
                }
                if (this.rules[单位][属性] === 合并后的数据.rules[单位][属性]) {
                    return "未修改";
                }
                return "已修改";
            },
            选择地图: async function () {
                try {
                    var [文件] = await window.showOpenFilePicker()
                    if (!文件) {
                        return;
                    }
                } catch (e) {
                    console.log('没有选择地图: ', e);
                }
                if (!文件) {
                    return;
                }
                this.选择的地图 = {};
                修改过的注册名 = {};
                this.文件名 = 文件.name;
                var 文件内容 = await 文件.getFile();
                文件内容 = await new Promise((resolve, reject) => {
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        var arrayBuffer = event.target.result;
                        var decoder = new TextDecoder('gb18030');  // 使用 'gb18030' 或者 'gbk'
                        var text = decoder.decode(new Uint8Array(arrayBuffer));
                        resolve(text);
                    };
                    reader.readAsArrayBuffer(文件内容);
                });


                var 选择的地图 = ini.parse(文件内容);
                合并后的数据 = 地图();
                await 合并后的数据.初始化();
                合并后的数据.合并地图(选择的地图);
                this.选择的地图 = 选择的地图;
                this.刷新所有类型();

                地图文件 = 文件;
                地图数据 = ini.parse(文件内容);
                地图内容 = 文件内容;


                // var 写入文件 = await 文件.createWritable();
                // await 写入文件.write("我靠, 牛掰!");
                // await 写入文件.close();
                // console.log("写入成功");

            },
            追加配置: async function () {
                try {
                    var [文件] = await window.showOpenFilePicker()
                    if (!文件) {
                        return;
                    }
                } catch (e) {
                    console.log('没有选择地图: ', e);
                }
                if (!文件) {
                    return;
                }
                var 文件内容 = await 文件.getFile();
                文件内容 = await 文件内容.text();
                var 选择的地图 = ini.parse(文件内容);
                for (var 注册名 in 选择的地图) {
                    for (var 属性名 in 选择的地图[注册名]) {
                        var 属性值 = 选择的地图[注册名][属性名];
                        if (typeof 合并后的数据.rules[注册名] == 'undefined') {
                            合并后的数据.rules[注册名] = {};
                        }
                        合并后的数据.rules[注册名][属性名] = 属性值;
                        if (typeof 地图数据[注册名] == 'undefined') {
                            地图数据[注册名] = {};
                        }
                        地图数据[注册名][属性名] = 属性值;
                    }
                    修改过的注册名[注册名] = true;
                }
                合并后的数据.合并地图({});
                this.刷新所有类型();
            },
            追加中文翻译: async function () {
                try {
                    var [文件] = await window.showOpenFilePicker()
                    if (!文件) {
                        return;
                    }
                } catch (e) {
                    console.log('没有选择文件: ', e);
                }
                if (!文件) {
                    return;
                }
                var 文件内容 = await 文件.getFile();
                文件内容 = await new Promise((resolve, reject) => {
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        var arrayBuffer = event.target.result;
                        var decoder = new TextDecoder('gb18030');  // 使用 'gb18030' 或者 'gbk'
                        var text = decoder.decode(new Uint8Array(arrayBuffer));
                        resolve(text);
                    };
                    reader.readAsArrayBuffer(文件内容);
                });

                var 翻译 = ini.parse(文件内容).csf || ini.parse(文件内容).CSF;
                var 转换后的翻译 = {};
                for (var i in 翻译) {
                    转换后的翻译[i.toLowerCase()] = 翻译[i];
                }
                合并后的数据.合并中文翻译(转换后的翻译);
                this.刷新所有类型();
            },
            编辑属性: function (注册名, 属性名, 属性值) {
                if (!地图文件) {
                    ElementPlus.ElNotification({
                        title: '提示',
                        message: '你还没有选择地图文件, 无法使用编辑功能!',
                        type: 'info',
                        duration: 3000,
                    })
                    return;
                }
                this.编辑属性对话框 = true;
                this.要编辑的单位 = {
                    注册名: 注册名,
                    属性名: 属性名,
                    属性值: 属性值
                };
            },
            保存属性: async function (编辑的单位) {
                this.编辑属性对话框 = false;
                if (typeof 合并后的数据.rules[编辑的单位.注册名] == 'undefined') {
                    合并后的数据.rules[编辑的单位.注册名] = {};
                }
                合并后的数据.rules[编辑的单位.注册名][编辑的单位.属性名] = 编辑的单位.属性值;
                await 合并后的数据.合并地图({});
                if (this.打开单位详情页面) {
                    this.显示详情(合并后的数据.rules[this.选中的注册名], this.选中的注册名);
                }
                this.刷新所有类型();
                修改过的注册名[编辑的单位.注册名] = true;
                if (typeof 地图数据[编辑的单位.注册名] == 'undefined') {
                    地图数据[编辑的单位.注册名] = {};
                }
                地图数据[编辑的单位.注册名][编辑的单位.属性名] = 编辑的单位.属性值;
            },
            直接删除属性不提示: async function (注册名, 属性名) {
                delete 合并后的数据.rules[注册名][属性名];
                await 合并后的数据.合并地图({});
                if (this.打开单位详情页面) {
                    this.显示详情(合并后的数据.rules[this.选中的注册名], this.选中的注册名);
                }
                this.刷新所有类型();

                修改过的注册名[注册名] = true;
                if (地图数据[注册名][属性名]) {
                    delete 地图数据[注册名][属性名];
                }
            },
            删除属性: async function (注册名, 属性名) {
                ElementPlus.ElMessageBox.confirm('确定要删除吗?', '提示',
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    })
                    .then(async () => {
                        await this.直接删除属性不提示(注册名, 属性名);
                        this.编辑属性对话框 = false;
                    })
                    .catch(() => {
                        // catch error
                    })

            },
            添加属性: function (注册名) {
                if (!地图文件) {
                    ElementPlus.ElNotification({
                        title: '提示',
                        message: '你还没有选择地图文件, 无法使用添加属性功能!',
                        type: 'info',
                        duration: 3000,
                    })
                    return;
                }
                this.要添加的属性 = {
                    注册名: 注册名,
                    属性名: '',
                    属性值: ''
                };
                this.添加属性对话框 = true;
            },
            保存添加的属性: async function (属性) {
                if (typeof 合并后的数据.rules[属性.注册名] == 'undefined') {
                    合并后的数据.rules[属性.注册名] = {};
                }
                合并后的数据.rules[属性.注册名][属性.属性名] = 属性.属性值;
                await 合并后的数据.合并地图({});
                if (this.打开单位详情页面) {
                    this.显示详情(合并后的数据.rules[this.选中的注册名], this.选中的注册名);
                }
                this.刷新所有类型();
                this.添加属性对话框 = false;
                修改过的注册名[属性.注册名] = true;
                if (!地图数据[属性.注册名]) {
                    地图数据[属性.注册名] = {};
                }
                地图数据[属性.注册名][属性.属性名] = 属性.属性值;
            },
            刷新所有类型: function () {
                this.刷新类型("建筑");
                this.刷新类型("士兵");
                this.刷新类型("战车或飞机");
            },
            刷新类型: function (类型) {
                switch (类型) {
                    case '建筑':
                        this.建筑列表 = {};
                        var 所有建筑 = 合并后的数据.获取所有建筑();
                        // 获取新创建的
                        for (var i in 所有建筑) {
                            if (!this.rules[i] && 合并后的数据.rules[i]) {
                                this.建筑列表[i] = JSON.parse(JSON.stringify(合并后的数据.rules[i]));;
                                this.建筑列表[i].状态 = '新增';
                            }
                        }
                        // 获取修改过的
                        for (var i in 所有建筑) {
                            // 有可能新的建筑没有在地图里面定义, 所以要判断是否存在
                            if (this.建筑列表[i] || !合并后的数据.rules[i]) {
                                continue;
                            }

                            if (JSON.stringify(所有建筑[i]) !== JSON.stringify(原始地图数据.rules[i])) {
                                this.建筑列表[i] = JSON.parse(JSON.stringify(合并后的数据.rules[i]));
                                this.建筑列表[i].状态 = '已修改';
                            }
                        }

                        // 获取未修改过的
                        for (var i in 所有建筑) {
                            if (this.建筑列表[i] || !合并后的数据.rules[i]) {
                                continue;
                            }
                            this.建筑列表[i] = JSON.parse(JSON.stringify(合并后的数据.rules[i]));
                            this.建筑列表[i].状态 = '未修改';
                        }
                        break;
                    case '士兵':
                        this.士兵列表 = {};
                        var 所有士兵 = 合并后的数据.获取所有士兵();
                        // 获取新创建的
                        for (var i in 所有士兵) {
                            if (!this.rules[i] && 合并后的数据.rules[i]) {
                                this.士兵列表[i] = JSON.parse(JSON.stringify(合并后的数据.rules[i]));
                                this.士兵列表[i].状态 = '新增';
                            }
                        }
                        // 获取修改过的
                        for (var i in 所有士兵) {
                            if (this.士兵列表[i] || !合并后的数据.rules[i]) {
                                continue;
                            }
                            if (JSON.stringify(所有士兵[i]) !== JSON.stringify(原始地图数据.rules[i])) {
                                this.士兵列表[i] = JSON.parse(JSON.stringify(合并后的数据.rules[i]));
                                this.士兵列表[i].状态 = '已修改';
                            }
                        }

                        // 获取未修改过的
                        for (var i in 所有士兵) {
                            if (this.士兵列表[i] || !合并后的数据.rules[i]) {
                                continue;
                            }
                            this.士兵列表[i] = JSON.parse(JSON.stringify(合并后的数据.rules[i]));
                            this.士兵列表[i].状态 = '未修改';
                        }
                        break;
                    case '战车或飞机':
                        this.战车或飞机列表 = {};
                        var 所有战车或飞机 = 合并后的数据.获取所有战车或飞机();
                        // 获取新创建的
                        for (var i in 所有战车或飞机) {
                            if (!this.rules[i] && 合并后的数据.rules[i]) {
                                this.战车或飞机列表[i] = JSON.parse(JSON.stringify(合并后的数据.rules[i]));
                                this.战车或飞机列表[i].状态 = '新增';
                            }
                        }
                        // 获取修改过的
                        for (var i in 所有战车或飞机) {
                            if (this.战车或飞机列表[i] || !合并后的数据.rules[i]) {
                                continue;
                            }
                            if (JSON.stringify(所有战车或飞机[i]) !== JSON.stringify(原始地图数据.rules[i])) {
                                this.战车或飞机列表[i] = JSON.parse(JSON.stringify(合并后的数据.rules[i]));
                                this.战车或飞机列表[i].状态 = '已修改';
                            }
                        }

                        // 获取未修改过的
                        for (var i in 所有战车或飞机) {
                            if (this.战车或飞机列表[i] || !合并后的数据.rules[i]) {
                                continue;
                            }
                            this.战车或飞机列表[i] = JSON.parse(JSON.stringify(合并后的数据.rules[i]));
                            this.战车或飞机列表[i].状态 = '未修改';
                        }
                        break;
                }
            },
            显示详情: function (单位, 注册名) {
                if (this.选中的注册名 != 注册名) {
                    this.激活选项卡 = '属性';
                }
                this.选中的单位 = 单位;
                this.要展示的数据 = JSON.parse(JSON.stringify(单位));
                delete this.要展示的数据.状态;
                delete this.要展示的数据.UIName2;
                this.选中的注册名 = 注册名;
                this.打开单位详情页面 = true;
            },
            保存地图: function () {
                保存地图();
            },
        }
    }).use(ElementPlus).mount('#app');
})();