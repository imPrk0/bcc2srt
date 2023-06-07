/**
 * BCC to SRT
 * @author Prk
 */

function convertBCCToSRT(bccData) {
    function formatTimeSRT(time) {
        function pad(number, length) {
            var str = String(number);
            while (str.length < length) {
                str = '0' + str;
            }
            return str;
        }

        var hours = Math.floor(time / 3600),
            minutes = Math.floor((time % 3600) / 60),
            seconds = (time % 60).toFixed(3).replace('.', ',');
    
        return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 6);
    }

    var bccObject = JSON.parse(bccData),
        lines = [];

    for (var i = 0; i < bccObject.body.length; i++) {
        var subtitle = bccObject.body[i],
            startTime = formatTimeSRT(subtitle.from),
            endTime = formatTimeSRT(subtitle.to),
            line = `${(i + 1)}\n${startTime} --> ${endTime}\n${subtitle.content}`;
        lines.push(line);
    }

    return lines.join('\n\n');
}

function convertSRTToBCC(srtData) {
    function parseTimeSRT(timeString) {
        var timeParts = timeString.split(':'),
            hours = parseInt(timeParts[0]),
            minutes = parseInt(timeParts[1]),
            seconds = parseFloat(timeParts[2].replace(',', '.'));
    
        return hours * 3600 + minutes * 60 + seconds;
    }

    var lines = srtData.trim().split('\n\n'),
        bccObject = {
            font_size: 0.4,
            font_color: '#FFFFFF',
            background_alpha: 0.5,
            background_color: '#9C27B0',
            Stroke: 'none',
            body: []
        };

    for (var i = 0; i < lines.length; i++) {
        var subtitle = lines[i].split('\n'),
            timeData = subtitle[1].split(' --> '),
            subtitleObject = {
                from: parseTimeSRT(timeData[0]),
                to: parseTimeSRT(timeData[1]),
                location: 2,
                content: subtitle[2]
            };

        bccObject.body.push(subtitleObject);
    }

    return JSON.stringify(bccObject);
}