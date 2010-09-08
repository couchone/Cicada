
            $.fn.serializeObject = function(prevent_dups)
            {
                if(prevent_dups == 'undefined') prevent_dups = true;
               var o = {};
               var a = this.serializeArray();
               $.each(a, function() {
                    if (this.value != '' && this.value != undefined) {
                        if (o[this.name] && prevent_dups == false) {
                            if (!o[this.name].push) {
                                o[this.name] = [o[this.name]];
                            }
                            o[this.name].push(this.value || '');
                        } else {
                            o[this.name] = this.value || '';
                        }
                    }
               });
               return o;
            };
            $.fn.serializeObjectValuesAsKeys = function()
            {
               var o = {};
               var a = this.serializeArray();
               $.each(a, function() {
                    if (this.value != '' && this.value != undefined) {
                        var v = $.transliterateAll(this.value);
                        if (o[v]) {
                            if (!o[v].push) {
                                o[v] = [o[v]];
                            }
                            o[v].push('');
                        } else {
                            o[v] = '';
                        }
                    }
               });
               delete o[''];
               return o;
            };
            $.fn.serializeObjectFromArray = function()
            {
                var o = {}
                $(this).each(function(idx, el) {
                  o[$.transliterateAll(el)] = el;
                });
                return o;
            }
            
            $.Cicada = {};
            $.Cicada.field_types = {
                        "date, birthday, anniversary": {
                            "format":"date-time",
                            "_inputex": {
                                "_type":"datepicker"
                            }
                        },
                        "time": {
                            "format":"time",
                            "_inputex": {
                                "_type":"time"
                            }
                        },
                        "color": {
                            "format":"color",
                            "_inputex": {
                                "_type":"color",
                                "palette": 3
                            }
                        },
                        "phone": {
                            "format":"phone"
                        },
                        "uri, url, web":{
                            "format":"uri",
                            "_inputex":{
                                "_type":"url",
                                "showMsg":true
                            }
                        },
                        "email":{
                            "format":"email",
                            "_inputex":{
                                "_type":"email",
                                "showMsg":true
                            }
                        },
                        "address, street address":{
                            "format":"street-address",
                            "_inputex":{
                                "_type":"street-address"
                            }
                        },
                        "ip, ip address":{
                            "format":"ip-address",
                            "_inputex":{
                                "_type":"IPv4",
                                "showMsg":true
                            }
                        },
                        "city, locality":{
                            "format":"locality",
                            "_inputex":{
                                "_type":"locality"
                            }
                        },
                        "state, region":{
                            "format":"region",
                            "_inputex":{
                                "_type":"region"
                            }
                        },
                        "zip, postal code":{
                            "format":"postal-code",
                            "_inputex":{
                                "_type":"postal-code"
                            }
                        },
                        "country":{
                            "format":"country",
                            "_inputex":{
                                "_type":"country"
                            }
                        }
                    };
            
            toJSONSchema = function(name, o) {
                var field_types = $.Cicada.field_types;
                var schema = {};
                schema[name] = {"id":name, "description":"Cicada generated JSON Schema for "+name,
                    "type":"object", "properties":o};

                for(var prop in schema[name].properties) {
                   schema[name].properties[prop] = {"type":"string", "optional":true, "title":schema[name].properties[prop],
                        "_inputex":{"label":schema[name].properties[prop]}};
                    
                    function mergeInFieldSettings(s, key) {
                        if (prop.search(new RegExp(s, "i")) != -1) {
                            for (var el in field_types[key]) {
                                if (typeof field_types[key][el] == 'object') {
                                    for (var el2 in field_types[key][el]) {
                                        schema[name].properties[prop][el][el2] = field_types[key][el][el2];
                                    }
                                } else {
                                    schema[name].properties[prop][el] = field_types[key][el];
                                }
                            }
                        }
                    }
                    
                    for (var key in field_types) {
                        if ((ses = key.split(',')).length > 1) {
                            $(ses).each(function(idx, s2) {
                                mergeInFieldSettings(s2.trim(), key);
                            });
                        } else {
                            mergeInFieldSettings(key, key);
                        }
                    }
                }
                return schema;
            };
            
            $.fn.toJSONSchema = function(name) {
                var o = this.serializeObject();
                return toJSONSchema(name, o);
            };
            
            $.fn.toInputExForm = function(schema, here, editing) {
                // Create the JsonSchema builder object
                var builder = new inputEx.JsonSchema.Builder({
                        'schemaIdentifierMap': schema,
                        'defaultOptions':{
                           'showMsg':true
                        }

                });
                
                // get schema name
                for(var name in schema) {}
                
                // Get the inputEx field definition from the "Person" object
                var inputExDefinition = builder.schemaToInputEx(schema[name]);
                
                // Add 'container1' as parent element
                inputExDefinition.parentEl = here;
                $(inputExDefinition.fields).each(function(idx, el) {
                    inputExDefinition.fields[idx] = {'type':'type', 'value':el};
                });
                
                $('#'+here).empty();
                // Create the form
                var f = inputEx(inputExDefinition);
            }