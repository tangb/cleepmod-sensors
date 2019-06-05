/**
 * Sensors service
 * Handle sensors module requests
 */
var sensorsService = function($q, $rootScope, rpcService, raspiotService) {
    var self = this;
    
    /**
     * Init module devices
     */
    self.initDevices = function(devices) {   
        for( var uuid in devices )
        {   
            if( devices[uuid].type==='motion' )
            {
                //change current color if gpio is on
                if( devices[uuid].on )
                {   
                    devices[uuid].__widget.mdcolors = '{background:"default-accent-400"}';
                }   
            }
        }

        return devices;
    };

    /**
     * Add new motion sensor
     */
    self.addGenericMotionSensor = function(name, gpio, inverted) {
        return rpcService.sendCommand('add_motion_generic', 'sensors', {'name':name, 'gpio':gpio, 'inverted':inverted});
    };

    /**
     * Add new onewire temperature sensor
     */
    self.addOnewireTemperatureSensor = function(name, device, path, interval, offset, offsetUnit) {
        return rpcService.sendCommand('add_temperature_onewire', 'sensors', {'name':name, 'device':device, 'path':path, 'interval':interval, 'offset':offset, 'offset_unit':offsetUnit});
    };

    /**
     * Update motion sensor
     */
    self.updateGenericMotionSensor = function(uuid, name, inverted) {
        return rpcService.sendCommand('update_motion_generic', 'sensors', {'uuid':uuid, 'name':name, 'inverted':inverted});
    };

    /**
     * Update onewire temperature sensor
     */
    self.updateOnewireTemperatureSensor = function(uuid, name, interval, offset, offsetUnit) {
        return rpcService.sendCommand('update_temperature_onewire', 'sensors', {'uuid':uuid, 'name':name, 'interval':interval, 'offset':offset, 'offset_unit':offsetUnit});
    };

    /**
     * Add DHT22 sensor
     */
    self.addDht22Sensor = function(name, gpio, interval, offset, offsetUnit) {
        return rpcService.sendCommand('add_dht22', 'sensors', {'name':name, 'gpio':gpio, 'interval':interval, 'offset':offset, 'offset_unit':offsetUnit});
    };

    /**
     * Update DHT22 sensor
     */
    self.updateDht22Sensor = function(oldName, newName, interval, offset, offsetUnit) {
        return rpcService.sendCommand('update_dht22', 'sensors', {'old_name':oldName, 'new_name':newName, 'interval':interval, 'offset':offset, 'offset_unit':offsetUnit});
    }

    /**
     * Delete sensor
     */
    self.deleteSensor = function(uuid) {
        return rpcService.sendCommand('delete_sensor', 'sensors', {'uuid':uuid});
    };

    /**
     * Get onewires devices
     */
    self.getOnewires = function() {
        return rpcService.sendCommand('get_onewire_devices', 'sensors');
    };

    /**
     * Install onewire driver
     */
    self.installOnewire = function() {
        return rpcService.sendCommand('install_onewire_driver', 'sensors');
    };

    /**
     * Uninstall onewire driver
     */
    self.uninstallOnewire = function() {
        return rpcService.sendCommand('uninstall_onewire_driver', 'sensors');
    };

    /**
     * Catch motion on event
     */
    $rootScope.$on('sensors.motion.on', function(event, uuid, params) {
        for( var i=0; i<raspiotService.devices.length; i++ )
        {   
            if( raspiotService.devices[i].uuid===uuid )
            {   
                raspiotService.devices[i].lastupdate = params.lastupdate;
                raspiotService.devices[i].on = true;
                raspiotService.devices[i].__widget.mdcolors = '{background:"default-accent-400"}';
                break;
            }   
        }   
    });

    /**
     * Catch motion off event
     */
    $rootScope.$on('sensors.motion.off', function(event, uuid, params) {
        for( var i=0; i<raspiotService.devices.length; i++ )
        {   
            if( raspiotService.devices[i].uuid===uuid )
            {
                raspiotService.devices[i].lastupdate = params.lastupdate;
                raspiotService.devices[i].on = false;
                raspiotService.devices[i].__widget.mdcolors = '{background:"default-primary-300"}';
                break;
            }   
        }   
    });

    /**
     * Catch temperature events
     */
    $rootScope.$on('sensors.temperature.update', function(event, uuid, params) {
        for( var i=0; i<raspiotService.devices.length; i++ )
        {   
            if( raspiotService.devices[i].uuid===uuid )
            {   
                raspiotService.devices[i].lastupdate = params.lastupdate;
                raspiotService.devices[i].celsius = params.celsius;
                raspiotService.devices[i].fahrenheit = params.fahrenheit;
                break;
            }   
        }   
    });

    /**
     * Catch humidity events
     */
    $rootScope.$on('sensors.humidity.update', function(event, uuid, params) {
        for( var i=0; i<raspiotService.devices.length; i++ )
        {   
            if( raspiotService.devices[i].uuid===uuid )
            {   
                raspiotService.devices[i].lastupdate = params.lastupdate;
                raspiotService.devices[i].humidity = params.humidity;
                break;
            }   
        }   
    });
};
    
var RaspIot = angular.module('RaspIot');
RaspIot.service('sensorsService', ['$q', '$rootScope', 'rpcService', 'raspiotService', sensorsService]);

