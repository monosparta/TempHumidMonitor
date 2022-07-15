import paho.mqtt.client as mqtt
import json
import datetime


class MQTT():
    def __init__(self, account: str, password: str, ip: str, topic: str, port: int = 1883, time: int = 60) -> None:
        # 建立客戶端物件
        self.client = mqtt.Client()
        # 設定客戶端帳號密碼
        self.client.username_pw_set(account, password)
        # 設定Broker資料
        self.client.connect(ip, port, time)
        # 設定時間格式
        self.ISOTIMEFORMAT = '%Y-%m-%d %H:%M:%S.%f'
        # 設定主題
        self.topic = topic

    # 發送資料函數
    def send_message(self, temperature: float, humidity: float) -> None:
        # 取得時間格式
        time = datetime.datetime.now().strftime(self.ISOTIMEFORMAT)[:-3]

        # 建立資料json格式
        payload = {'Temperature': temperature, 'Humidity': humidity, 'Time': time}

        # 印出資料
        print(F"Sent data: {json.dumps(payload)}")

        # 要發布的主題和內容
        self.client.publish(self.topic, json.dumps(payload))
