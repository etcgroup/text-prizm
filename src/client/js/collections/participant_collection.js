define(['backbone', 'models/participant_model'],
    function(Backbone, Participant) {

        var ParticipantCollection = Backbone.Collection.extend({
            model: Participant,
            comparator: function(participant) {
                return participant.get('name');
            },
            assignColors: function() {

                var assigned = 0;
                this.each(function(participant) {
                    if (participant.get('messages').length > 0) {
                        assigned++;
                    }
                });

                var hueIncrement = 255 / (assigned+1);
                var hue = 0;
                this.each(function(participant) {
                    if (participant.get('messages').length > 0) {
                        hue += hueIncrement;
                        var sat = 70;
                        var lightness = 60;
                        participant.set('color', 'hsl(' + hue + ', ' + sat + '%, ' + lightness + '%)');
                    } else {
                        participant.set('color', null);
                    }
                });

                console.log("Colors assigned to " + assigned + " participants");
            }
        });
        return ParticipantCollection;
    });