from pyclbr import Class
import time
import Adafruit_DHT
import LCD_drive as driver
import mqtt_publish
import os
import json


def read_json() -> dict:
    try:

        with open("config.json") as f:
            return json.loads(f.read())

    except FileNotFoundError:
        raise FileNotFoundError("Couldn't find a setting.json file containing mqtt and gpio settings!")


def connect_to_mqtt(data) -> Class:
    return mqtt_publish.MQTT(
        data["mqtt"]["username"],
        data["mqtt"]["password"],
        data["mqtt"]["host"],
        data["mqtt"]["topic"],
    )


def main() -> None:

    data = read_json()

    mqtt_publisher = connect_to_mqtt(data)

    # 建立LCD物件
    mylcd = driver.lcd()

    print('按下 Ctrl-C 可停止程式')
    mylcd.lcd_display_string("Loading.")
    time.sleep(0.3)
    mylcd.lcd_display_string("Loading..")
    time.sleep(0.3)
    mylcd.lcd_display_string("Loading...")

    # 等待0.5秒
    time.sleep(0.5)

    try:
        while True:
            # 偵測溫溼度資料
            h, t = Adafruit_DHT.read_retry(Adafruit_DHT.DHT11, data['gpio']["DHT11"])

            # 判斷資料是否為None型別
            if h is not None and t is not None:
                # 顯示溫溼度資料
                print(F'溫度={t:0.1f}度C 濕度={h:0.1f}%')

                # LCD第一行顯示溫度
                mylcd.lcd_display_string(F" Temp: {t:0.1f} {chr(223)}C", 1, clean=True)

                # LCD第二行顯示濕度
                mylcd.lcd_display_string(F"Humid: {h:0.1f}  %", 2)

                # 發送mqtt資料
                mqtt_publisher.send_message(temperature=t, humidity=h)
            else:
                print('讀取失敗，重新讀取。')

            time.sleep(data['interval'])

    except KeyboardInterrupt:
        print('關閉程式')
        mylcd.lcd_clear()


if __name__ == "__main__":
    main()
