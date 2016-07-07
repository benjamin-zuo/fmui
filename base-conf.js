/**
 * 
 * @authors zuojj (cuew1987@gmail.com)
 * @link    https://github.com/zuojj
 * @date    2016-07-07 13:53:10
 */

/**
 * 兼容v3.4.6修改fis.require 策略，不再名字优先，而是路径优先。且不会找到项目以外的 npm 
 * 包。
 */
if(parseInt( fis.version.replace(/\./g, '') ) >= 346) {
    var path = require('path');
    fis.require.paths.unshift(path.join(__dirname, '/node_modules'));
}

fis.require('arrow')(fis);