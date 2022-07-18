from pyclbr import Class
import time
import dht11
import LCD_drive as driver
import mqtt_publish
import json
import RPi.GPIO as gpio


# read the json file
def read_json() -> dict:
    try:
        with open("temp_humid_project/TempHumidRPI/config.json") as f:
            return json.loads(f.read())
    except FileNotFoundError:
        raise FileNotFoundError("Couldn't find a setting.json file containing mqtt and gpio settings!")


# connect to mqtt
def connect_to_mqtt(data: dict) -> Class:
    return mqtt_publish.MQTT(
        data["mqtt"]["username"],
        data["mqtt"]["password"],
        data["mqtt"]["host"],
        data["mqtt"]["topic"],
    )


def main() -> None:

    gpio.setmode(gpio.BOARD)

    data = read_json()

    mqtt_publisher = connect_to_mqtt(data)

    gpio.setup(data["gpio"]["green_led"], gpio.OUT)

    # 建立LCD物件
    mylcd = driver.lcd()

    mylcd.lcd_clear()

    print('按下 Ctrl-C 可停止程式')
    mylcd.lcd_display_string("Loading.")
    time.sleep(0.3)
    mylcd.lcd_display_string("Loading..")
    time.sleep(0.3)
    mylcd.lcd_display_string("Loading...")

    time.sleep(0.5)
    try:
        while True:
            # 偵測溫溼度資料
            envir_data = dht11.DHT11(pin=7).read()

            # 判斷資料是否為None型別
            if envir_data.temperature or envir_data.humidity != 0:
                gpio.output(data["gpio"]["green_led"], True)

                # 顯示溫溼度資料
                print(F'溫度={envir_data.temperature:0.1f}{chr(223)}C 濕度={envir_data.humidity:0.1f}%')

                # LCD第一行顯示溫度
                mylcd.lcd_display_string(F" Temp: {envir_data.temperature:0.1f} {chr(223)}C", 1, clean=True)

                # LCD第二行顯示濕度
                mylcd.lcd_display_string(F"Humid: {envir_data.humidity:0.1f}  %", 2)

                # 發送mqtt資料
                mqtt_publisher.send_message(temperature=envir_data.temperature, humidity=envir_data.humidity)
            else:
                print('讀取失敗，重新讀取。')

            time.sleep(data['interval'])

    except KeyboardInterrupt:
        print('關閉程式')
        mylcd.lcd_clear()
        mylcd.lcd_display_string("See you!")
        time.sleep(1)
        mylcd.lcd_clear()
        gpio.output(data["gpio"]["green_led"], False)
        gpio.cleanup()


if __name__ == "__main__":
    main()
