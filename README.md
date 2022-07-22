# 樹莓派溫濕度實作

<!-- 前端和物理照 -->
![](https://i.imgur.com/WHiYFPo.png)
![](https://i.imgur.com/6E0oicH.jpg)


## 前端
- Figma
- React
- recharts(圖表)
- Mui(Bar & Card)


## 後端
- Node.js Typescript
- SQLite3
- MQTT
- Socket.io
- Express.js

## 代理
- Nginx

## IoT
- Python
- MQTT
- DHT11
- LCD
- RED LED
- GREEN LED

## 開發流程
- Figma 繪製構想畫面
- React 刻出畫面
- 撰寫 Python 程式讀取感測器資料
- 透過 MQTT 將資料傳送到後端並存到 SQLite3 資料庫
- 撰寫 API 以用來抓取歷史統計資料
- 透過 Socket.io 連線傳送即時溫濕度資料到前端

## 程式流程
![](https://i.imgur.com/QubuvwO.png)
- 啟動樹莓派，PM2 自動啟動主程式，並啟動 Nginx 代理網頁和 API
- 主程式啟動，紅燈亮起，閃爍綠燈執行緒啟動
- 開始驅動 DHT11 感測資料
- LCD 顯示感測資料
- 使用MQTT將資料發送至後端
- 後端接收 MQTT 資料，儲存到資料庫並利用 Socket.io 傳送即時資料到前端
- 前端發送 request 到後端讀取歷史資料，並透過 Socket.io 接收即時資料
