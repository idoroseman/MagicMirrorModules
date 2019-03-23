
Module.register("MMM-MQTTStatusChecker",{

    getScripts: function() {
        return [
            this.file('node_modules/jsonpointer/jsonpointer.js')
        ];
    },

    // Default module config
    defaults: {
        mqttServer: 'localhost',
        subscriptions: []
    },

	start: function() {
        console.log(this.name + ' started.');
        this.subscriptions = [];

        console.log(this.name + ': Setting up ' + this.config.subscriptions.length + ' topics');

        for(i = 0; i < this.config.subscriptions.length; i++){
            console.log(this.name + ': Adding config ' + this.config.subscriptions[i].label + ' = ' + this.config.subscriptions[i].topic);
            
            this.subscriptions[i] = {
                label: this.config.subscriptions[i].label,
                icon: this.config.subscriptions[i].icon,
                topic: this.config.subscriptions[i].topic,
                decimals: this.config.subscriptions[i].decimals,
                jsonpointer: this.config.subscriptions[i].jsonpointer,
                suffix: typeof(this.config.subscriptions[i].suffix) == 'undefined' ? '' : this.config.subscriptions[i].suffix,
				trueString: this.config.subscriptions[i].trueString,
				trueSound: this.config.subscriptions[i].trueSound,
				trueSay: this.config.subscriptions[i].trueSay,
				falseString: this.config.subscriptions[i].falseString,
				falseSound: this.config.subscriptions[i].falseSound,
				falseSay: this.config.subscriptions[i].falseSay,
                value: false,
                prevvalue: false,
            }
        }
    
		this.openMqttConnection();
        var self = this;
        setInterval(function() {
            self.updateDom(1000);
        }, 10000);
	},

	openMqttConnection: function() { 
		this.sendSocketNotification('MQTT_CONFIG', this.config);
	},

	socketNotificationReceived: function(notification, payload) {
		if(notification === 'MQTT_PAYLOAD'){
			if(payload != null) {
                for(i = 0; i < this.subscriptions.length; i++){
                    if(this.subscriptions[i].topic == payload.topic){
                        var value = payload.value;
                        // Extract value if JSON Pointer is configured
                        if(this.subscriptions[i].jsonpointer) {
                            value = get(JSON.parse(value), this.subscriptions[i].jsonpointer);
                        }
                        // Round if decimals is configured
                        if(isNaN(this.subscriptions[i].decimals) == false) {
                            if (isNaN(value) == false){
                                value = Number(value).toFixed(this.subscriptions[i].decimals);
                            }
                        }
                        console.log("payload"+value);
                        if ((value.toUpperCase() == "TRUE") || (value.toUpperCase() == "ON") || (value.toUpperCase() == "1"))
                          value = true;
                        else if ((value.toUpperCase() == "FALSE") || (value.toUpperCase() == "OFF") || (value.toUpperCase() == "0"))
                          value = false;  
                        this.subscriptions[i].value = value;
                    }
                }
				this.updateDom();
			} else {
                console.log(this.name + ': MQTT_PAYLOAD - No payload');
            }
		}
	},

    getStyles: function() {
        return [
            'MQTT.css'
        ];
    },

	getDom: function() {
        self = this;
		var wrapper = document.createElement("table");
        wrapper.className = "small";
        var first = true;
    
        if (self.subscriptions.length === 0) {
            wrapper.innerHTML = (self.loaded) ? self.translate("EMPTY") : self.translate("LOADING");
            wrapper.className = "small dimmed";
            console.log(self.name + ': No values');
            return wrapper;
        }        

        self.subscriptions.forEach(function(sub){
            var subWrapper = document.createElement("tr");
            var icon;
            if (sub.icon) {
            icon = document.createElement("i");
            icon.setAttribute("aria-hidden","true");
            icon.className = "fa fa-"+sub.icon;
            }
            var txt = document.createElement("td");

            if (sub.value) {
                if (icon) { icon.style.cssText="color:green;"; }
                txt.innerHTML = "&nbsp;&nbsp;" + sub.trueString;
                subWrapper.className = sub.trueClass;
                if (sub.value != sub.prevvalue) {
                    sub.prevvalue = sub.value;
					if (this.config.showTrueAlert && sub.resultChanged) {
						this.sendNotification("SHOW_ALERT", {
						type: "notification",
						title: "Alert",
						message: sub.trueString,
						});
					}
					if (typeof sub.trueSound  !== 'undefined') {
  					  sub.trueSound.split(',').forEach((name)=>{
				        self.sendNotification('PLAY_SOUND', name.trim()+".wav");
				        })
					}
					if (typeof sub.trueSay  !== 'undefined') {
					  this.sendNotification('MMM-TTS', sub.trueSay);
					}
                }
            } else {
            if (icon) { icon.style.cssText="color:red;"; }
                txt.innerHTML = "&nbsp;&nbsp;" + sub.falseString;
                subWrapper.className = sub.falseClass;
                if (sub.value != sub.prevvalue){
					sub.prevvalue = sub.value				
					if (this.config.showFalseAlert && sub.resultChanged) {
						this.sendNotification("SHOW_ALERT", {
						type: "notification",
						title: "Alert",
						message: this.config.falseString,
						});
					}
				   if (typeof sub.falseSound  !== 'undefined') {
				      sub.falseSound.split(',').forEach((name)=>{
				        self.sendNotification('PLAY_SOUND', name.trim()+".wav");
				        })
					  
					}
					if (typeof sub.falseSay  !== 'undefined') {
					  self.sendNotification('MMM-TTS', sub.falseSay);
					}
				}
            }
            if (icon) { subWrapper.appendChild(icon); }
            subWrapper.appendChild(txt);
            
            wrapper.appendChild(subWrapper);
        });

        return wrapper;
    }
});