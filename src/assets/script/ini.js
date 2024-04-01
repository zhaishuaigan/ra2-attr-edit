(function (w) {
    w.ini = {
        parse: function (text) {
            var data = text.split('\n');
            var section = '';
            var result = {};
            for (var i = 0; i < data.length; i++) {
                var line = data[i].trim();
                if (line.length === 0 || line[0] === ';' || line[0] === '=') {
                    continue;
                }
                if (line.substring(0, 2) === '//') {
                    continue;
                }
                line = line.split(';')[0].trim();
                if (line[0] === '[') {
                    section = line.substring(1, line.length - 1);
                    result[section] = {};
                } else {
                    var pair = line.split('=');
                    result[section][pair[0].trim()] = line.substring(pair[0].length + 1).trim();
                }
            }
            return result;
        },
        stringify: function (data) {
            var result = '';
            for (var section in data) {
                result += '[' + section + ']\n';
                for (var key in data[section]) {
                    result += key + '=' + data[section][key] + '\n';
                }
            }
            return result;
        }
    }
})(window);
