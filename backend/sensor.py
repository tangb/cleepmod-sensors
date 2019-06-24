#!/usr/bin/env python
# -*- coding: utf-8 -*-

class Sensor():
    """
    Sensor base class

    Sensor instance must declare following members:
     - TYPES (list): list of supported sensors types (temperature, motion, humidity, pressure...)
     - SUBTYPE (string): name of subtype. Usually name of sensor type (dht, onewire...)
    """
    def __init__(self, sensors):
        """
        Constructor
        """
        self.sensors = sensors
        self.logger = sensors.logger
        #will be filled by sensors during module configuration
        self.raspi_gpios = {}
        self.drivers = {}
        self.cleep_filesystem = sensors.cleep_filesystem

    def _register_driver(self, driver):
        """
        Register driver
        """
        self.sensors._register_driver(driver)
        self.drivers[driver.name] = driver

    def has_drivers(self):
        """
        Has addon drivers registered ?

        Returns:
            bool: True if a driver is registered
        """
        return len(self.drivers)>0

    def _get_event(self, event_name):
        """
        Returns event name

        Returns:
            event (Event): event or None
        """
        return self.sensors._get_event(event_name)

    def send_command(self, command, to, params=None, timeout=3.0):
        """
        Send command on internal bus
        """
        return self.sensors.send_command(command, to, params, timeout)
              
    def update_value(self, sensor):
        """
        Update sensor values (timestamp, temperature, motion status...)
        
        Args:
            sensor (dict): sensor data
        """
        return self.sensors._update_device(sensor[u'uuid'], sensor)
        
    def _search_device(self, key, value):
        """
        Search first device that matches specified criteria
        
        Args:
            key (string): field key
            value (string): field value
        """
        return self.sensors._search_device(key, value)
        
    def _search_devices(self, key, value):
        """
        Search add devices that match specified criteria
        
        Args:
            key (string): field key
            value (string): field value
        """
        return self.sensors._search_devices(key, value)

    def _search_by_gpio(self, gpio_uuid):
        """
        Search sensor connected to specified gpio_uuid

        Params:
            gpio_uuid (string): gpio uuid to search

        Returns:
            dict: sensor data or None if nothing found
        """
        self.sensors._search_by_gpio(gpio_uuid)
        
    def _get_device(self, uuid):
        """
        Return device according to uuid
        
        Args:
            uuid (string): device uuid
        """
        return self.sensors._get_device(uuid)
        
    def _get_assigned_gpios(self):
        """
        Return assigned gpios

        Returns:
            dict: assigned gpios
        """
        return self.sensors._get_assigned_gpios()
        
    def update(self, sensor):
        """
        Returns sensor data to update
        Can perform specific stuff
        
        Returns:
            dict: sensor data to update::
            
                {
                    gpios (list): list of gpios data to add
                    sensors (list): list sensors data to add
                }
                
        """
        raise NotImplementedError(u'Function "update" must be implemented in "%s"' % self.__class__.__name__)
        
    def add(self):
        """
        Return sensor data to add.
        Can perform specific stuff
        
        Returns:
            dict: sensor data to add::
            
                {
                    gpios (list): list of gpios data to add
                    sensors (list): list sensors data to add
                }
                
        """
        raise NotImplementedError(u'Function "add" must be implemented in "%s"' % self.__class__.__name__)
        
    def delete(self, sensor):
        """
        Returns sensor data to delete
        Can perform specific stuff
        
        Returns:
            dict: sensor data to delete::
            
                {
                    gpios (list): list of gpios data to add
                    sensors (list): list sensors data to add
                }

        """
        return {
            u'gpios': [gpio for gpio in sensor[u'gpios']],
            u'sensors': [sensor,],
        }
               
    def get_task(self, sensors):
        """
        Prepare specific sensor task
        
        Args:
            sensors (list): list of sensors data (dict)
        
        Returns:
            Task: task instance that will be launched by sensors instance or None if no task needed
        """
        raise NotImplementedError(u'Function "get_task" must be implemented in "%s"' % self.__class__.__name__)
        
    def process_event(self, event, sensor):
        """
        Process received event
        
        Args:
            event (MessageRequest): gpio event
            sensor (dict): sensor data
        """
        pass
