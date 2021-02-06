//操作文件
/*
  1、fs.stat 获取文件状态
  2、fs.readdir 读取文件夹数据
  3、fs.access 判断文件夹是否存在
  4、path.join 拼路径
*/
//操作文件
const fs = require('fs');
//操作路径
const path = require('path');
//1.接受命令行命令
//3.判断路径是否存在
//2.修正路径
let inputPath = process.argv[2]; //[2]是输入的路径名
if (!inputPath) {
  //判断有没有输入内容
  throw '请输入文件名！';
}
//转换路径格式为绝对路径
inputPath = path.resolve(inputPath);
//输入的路径存在就执行递归
try {
  //扩展：'.F_OK'==='检查目录中是否存在文件'
  //'.R_OK'==='检查文件是否可读',详细见nodejs文档
  //也可以这样写 ：判断是否存在，以及是否可读
  //fs.accessSync(inputPath,fs.constants.F_OK|fs.constants.R_OK);
  //这里的 fs.constants.F_OK 是默认值，不用写
  fs.accessSync(inputPath);
  testReadFiles(inputPath);
} catch (err) {
  console.log(err);
}

function testReadFiles(filePath) {
  let state = fs.statSync(filePath);
  if (state.isFile()) {
    //是文件
    console.log(filePath, 'isFile');
    const data = fs.readFileSync(filePath, 'utf8').split('\n');
    data.splice(
      1,
      0,
      `  <!--
  * 仓秘书免费开源WMS仓库管理系统+订货订单管理系统
  *
  * (c) Hunan NLE Network Technology Co., Ltd. <cangmishu.com>
  *
  * For the full copyright and license information, please view the LICENSE
  * file that was distributed with this source code.
  *
  -->`
    );
    fs.writeFileSync(filePath, data.join('\n'), 'utf8');
  } else if (state.isDirectory()) {
    //是文件夹
    //先读取
    let files = fs.readdirSync(filePath);
    files.forEach(file => {
      console.log(path.join(filePath, file) + '，file');
      testReadFiles(path.join(filePath, file));
    });
  }
}
