from threading import Thread
import RPi.GPIO as gpio
import time


class Blink(Thread):
    def __init__(self, data: str) -> None:
        super(Blink, self).__init__()

        # set up the gpio mode
        gpio.setmode(gpio.BOARD)

        # get the config data
        self.data = data

        # assign the number green led pin
        self.pin_g = self.data["gpio"]["green_led"]

        # setup the green led pin mode
        gpio.setup(self.pin_g, gpio.OUT)

        # enable thread flag
        self.enable_flag = False

    def run(self) -> None:
        while self.enable_flag:
            gpio.output(self.pin_g, True)
            time.sleep(1)
            gpio.output(self.pin_g, False)
            time.sleep(1)

    # stop thread method
    def stop_thread(self) -> None:
        self.enable_flag = False

    # start thread method
    def enable_thread(self) -> None:
        self.enable_flag = True
