import time
import Adafruit_DHT
import LCD_drive as driver
import mqtt_publish

# MQTT設定
mqtt_data = {
    "account": "demo",
    "password": "demo0712",
    "ip": "192.168.168.113",
    "port": 1883,
    "time": 60,
    "topic": "THP/DATA"
}

# GPIO設定
gpio_pin = {
    "DHT11": 4,
}

# 建立LCD物件
mylcd = driver.lcd()

# 建立MQTT物件
mqtt_publish = mqtt_publish.MQTT(
    mqtt_data["account"],
    mqtt_data["password"],
    mqtt_data["ip"],
    mqtt_data["topic"],
)


def main() -> None:
    print('按下 Ctrl-C 可停止程式')
    mylcd.lcd_display_string("Loading.")
    time.sleep(0.1)
    mylcd.lcd_display_string("Loading..")
    time.sleep(0.1)
    mylcd.lcd_display_string("Loading...")

    # 等待0.5秒
    time.sleep(0.5)

    try:
        while True:
            # 偵測溫溼度資料
            h, t = Adafruit_DHT.read_retry(Adafruit_DHT.DHT11, gpio_pin["DHT11"])

            # 判斷資料是否為None型別
            if h is not None and t is not None:
                # 顯示溫溼度資料
                print(F'溫度={t:0.1f}度C 濕度={h:0.1f}%')

                # LCD第一行顯示溫度
                mylcd.lcd_display_string(F" Temp: {t:0.1f} {chr(223)}C", 1, clean=True)

                # LCD第二行顯示濕度
                mylcd.lcd_display_string(F"Humid: {h:0.1f}  %", 2)

                # 發送mqtt資料
                mqtt_publish.send_message(temperature=t, humidity=h)
            else:
                print('讀取失敗，重新讀取。')

            time.sleep(5)

    except KeyboardInterrupt:
        print('關閉程式')
        mylcd.lcd_clear()


if __name__ == "__main__":
    main()
