# 仓秘书是一套免费轻量级开源WMS仓库管理系统+开源订货订单管理系统

前端采用Vue.js 小程序采用Taro，后端采用PHP+Docker+Laravel 8.0

支持前后端分离，支持Docker容器化，支持小程序，支持平台化，具有一定商业化的竞争力

开源目的：
1. 为社区贡献
2. 期待更多人参与

## 功能
### 自定义配置仓库设置
自由配置仓库，单个账号支持添加多仓库。货区、货架、供应商、地址库、出入库单分类等均可自由配置。

### 精细化库存管理
针对不同种类的商品，提供不同的商品库存管理方式。提高库存管理效率，降低因库存不正确等原因造成企业损失。

### 智能进出库管理，提供最优出库方案
根据商品SKU最小规格进行商品进出库管理，对每个批次分开管理记录，先进先出，保证仓库库存为最新，避免出现库存过期造成损失。

### 库存预警系统
设置仓库商品库存预警，及时预警库存不足商品，及时补货，保证商品库存充足。

### 高效拣货流程，减少拣货时间，提高效率
提供拣货单，精确至商品批次及货位，提高拣货效率。

### 一键发货，订单可跟踪
一键发货，订单状态可跟踪，方便及时了解订单的最新物流信息。

### 自带订货系统
为您生成微信小程序、百度小程序、抖音小程序、H5

### 开放API接口
可与ERPOMSTMS 数据对接与集成

![WEB端](https://www.cangmishu.com/image/index/index-pc.png)  
![小程序端](https://www.cangmishu.com/image/index/index-mini.png)  
![订货端](https://www.cangmishu.com/image/index/index-minimall.png)

### 配置开源网址

[仓秘书API端源码](https://github.com/nletech/cangmishu)    
[仓秘书用户界面开源网址](https://github.com/nletech/cangmishu-user)     

### 相关连接
[仓秘书官网网站](https://www.cangmishu.com/)    
[恩尔伊科技](https://www.nle-tech.com/)     


## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Run your end-to-end tests
```
yarn test:e2e
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
