import time
import LCD_drive as driver
import json
import RPi.GPIO as gpio
from dht11 import DHT11
from blink import Blink
from mqtt_publish import MQTT


class MainFunction():
    # constructor
    def __init__(self, data: str) -> None:

        # set up the gpio mode
        gpio.setmode(gpio.BOARD)

        # get the config data
        self.data = data

        # create the lcd class
        self.mylcd = driver.lcd()

        # assign the number red led pin
        self.pin_r = self.data["gpio"]["red_led"]

        # create the blink class
        self.Blink = Blink(self.data)

        # create the mqtt class
        self.mqtt_publisher = MQTT(
            self.data["mqtt"]["username"],
            self.data["mqtt"]["password"],
            self.data["mqtt"]["host"],
            self.data["mqtt"]["topic"],
        )

        # setup the red led pin mode
        gpio.setup(self.pin_r, gpio.OUT)

    # start sensoring function
    def start_sensoring(self) -> None:

        # greeting
        self.greeting()

        # light up the red led
        gpio.output(self.pin_r, True)

        try:
            while True:

                # get the DHT11 data
                envir_data = DHT11(pin=self.data["gpio"]["DHT11"]).read()

                # 判斷資料是否為None型別
                if envir_data.temperature or envir_data.humidity != 0:
                    gpio.output(self.data["gpio"]["green_led"], True)

                    # 顯示溫溼度資料
                    print(F'溫度={envir_data.temperature:0.1f}°C 濕度={envir_data.humidity:0.1f}%')

                    # LCD第一行顯示溫度
                    self.mylcd.lcd_display_string(F" Temp: {envir_data.temperature:0.1f} {chr(223)}C", 1, clean=True)

                    # LCD第二行顯示濕度
                    self.mylcd.lcd_display_string(F"Humid: {envir_data.humidity:0.1f}  %", 2)

                    # 發送mqtt資料
                    self.mqtt_publisher.send_message(temperature=envir_data.temperature, humidity=envir_data.humidity)

                    time.sleep(self.data['interval'])
                else:
                    print('讀取失敗，重新讀取。')

                    time.sleep(1)

        except KeyboardInterrupt:
            print('關閉程式')
            self.mylcd.lcd_clear()
            self.mylcd.lcd_display_string("See you!")
            time.sleep(1)
            self.mylcd.lcd_clear()
            gpio.output(self.data["gpio"]["green_led"], False)
            gpio.output(self.pin_r, False)
            gpio.cleanup()

    # stop thread method
    def stop_thread(self) -> None:
        self.Blink.stop_thread()
        self.Blink.quit()
        self.Blink.wait()

    # start thread method
    def start_thread(self) -> None:
        self.Blink.enable_thread()
        self.Blink.start()

    # greeting function
    def greeting(self):
        print('按下 Ctrl-C 可停止程式')
        self.mylcd.lcd_display_string("Loading.")
        time.sleep(0.3)
        self.mylcd.lcd_display_string("Loading..")
        time.sleep(0.3)
        self.mylcd.lcd_display_string("Loading...")


# main function
def main() -> None:

    try:
        with open("./config.json") as f:
            data = json.loads(f.read())
    except FileNotFoundError:
        raise FileNotFoundError("Couldn't find a setting.json file containing mqtt and gpio settings!")

    # create the main_funciton class
    main_function = MainFunction(data)

    # enable the blinking thread
    main_function.start_thread()

    # enable the DHT11 sensor
    main_function.start_sensoring()


if __name__ == "__main__":
    main()
