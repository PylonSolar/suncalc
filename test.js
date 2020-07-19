import * as SunCalc from "./suncalc.js";
import { assert, assertEquals } from "https://deno.land/std@0.61.0/testing/asserts.ts";

function near(val1, val2, margin) {
    return Math.abs(val1 - val2) < (margin || 1E-15);
}

var date = new Date('2013-03-05UTC'),
    lat = 50.5,
    lng = 30.5,
    height = 2000;

var testTimes = {
    solarNoon: '2013-03-05T10:10:57Z',
    nadir: '2013-03-04T22:10:57Z',
    sunrise: '2013-03-05T04:34:56Z',
    sunset: '2013-03-05T15:46:57Z',
    sunriseEnd: '2013-03-05T04:38:19Z',
    sunsetStart: '2013-03-05T15:43:34Z',
    dawn: '2013-03-05T04:02:17Z',
    dusk: '2013-03-05T16:19:36Z',
    nauticalDawn: '2013-03-05T03:24:31Z',
    nauticalDusk: '2013-03-05T16:57:22Z',
    nightEnd: '2013-03-05T02:46:17Z',
    night: '2013-03-05T17:35:36Z',
    goldenHourEnd: '2013-03-05T05:19:01Z',
    goldenHour: '2013-03-05T15:02:52Z'
};

var heightTestTimes = {
    solarNoon: '2013-03-05T10:10:57Z',
    nadir: '2013-03-04T22:10:57Z',
    sunrise: '2013-03-05T04:25:07Z',
    sunset: '2013-03-05T15:56:46Z'
};

Deno.test('getPosition returns azimuth and altitude for the given time and location', function() {
    var sunPos = SunCalc.getPosition(date, lat, lng);

    assert(near(sunPos.azimuth, -2.5003175907168385), 'azimuth');
    assert(near(sunPos.altitude, -0.7000406838781611), 'altitude');
});

Deno.test('getTimes returns sun phases for the given date and location', function() {
    var times = SunCalc.getTimes(date, lat, lng);

    for (var i in testTimes) {
        assertEquals(new Date(testTimes[i]).toUTCString(), times[i].toUTCString(), i);
    }
});

Deno.test('getTimes adjusts sun phases when additionally given the observer height', function() {
    var times = SunCalc.getTimes(date, lat, lng, height);

    for (var i in heightTestTimes) {
        assertEquals(new Date(heightTestTimes[i]).toUTCString(), times[i].toUTCString(), i);
    }
});

Deno.test('getMoonPosition returns moon position data given time and location', function() {
    var moonPos = SunCalc.getMoonPosition(date, lat, lng);

    assert(near(moonPos.azimuth, -0.9783999522438226), 'azimuth');
    assert(near(moonPos.altitude, 0.014551482243892251), 'altitude');
    assert(near(moonPos.distance, 364121.37256256194), 'distance');
});

Deno.test('getMoonIllumination returns fraction and angle of moon\'s illuminated limb and phase', function() {
    var moonIllum = SunCalc.getMoonIllumination(date);

    assert(near(moonIllum.fraction, 0.4848068202456373), 'fraction');
    assert(near(moonIllum.phase, 0.7548368838538762), 'phase');
    assert(near(moonIllum.angle, 1.6732942678578346), 'angle');
});

Deno.test('getMoonTimes returns moon rise and set times', function() {
    var moonTimes = SunCalc.getMoonTimes(new Date('2013-03-04UTC'), lat, lng, true);

    assertEquals(moonTimes.rise.toUTCString(), 'Mon, 04 Mar 2013 23:54:29 GMT');
    assertEquals(moonTimes.set.toUTCString(), 'Mon, 04 Mar 2013 07:47:58 GMT');

});
