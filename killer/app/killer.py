import time
import datetime
import os
from signal import signal, SIGINT, SIGTERM
from sys import exit

app_name = os.environ.get('APP_NAME', 'UNKNOWN')

def handler(signal_received, frame):
    dt = datetime.datetime.now().strftime("%Y-%m-%d_%H:%M:%S")
    message = '{} is stopping at {} signal: {}'.format(app_name, dt, signal_received)
    print message
    exit(0)

if __name__ == '__main__':
    # Tell Python to run the handler() function when SIGINT is received
    signal(SIGINT, handler)
    signal(SIGTERM, handler)

    print('Running App {} at {}').format(app_name, datetime.datetime.now().strftime("%Y-%m-%d_%H:%M:%S"))
    while True:
        dt = datetime.datetime.now().strftime("%Y-%m-%d_%H:%M:%S")
        message = '{} pulse {}'.format(app_name, dt)
        print message
        time.sleep(1)
