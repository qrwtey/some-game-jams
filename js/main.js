jQuery(document).ready(function() {

    // inner variables
    var song;
    var tracker = $('.tracker');
    var volume = $('.volume');
    var isPlaying = false;
    var currentVolume = 0.8; // Initialize with default volume (80%)

    function initAudio(elem) {
        var url = elem.attr('audiourl');
        var title = elem.text();
        var cover = elem.attr('cover');
        var artist = elem.attr('artist');
        console.log("clicked on " + url);
        $('.player .title').text(title);
        $('.player .artist').text(artist);
        $('.player .cover').css('background-image','url(data/' + cover + ')');

        song = new Audio('data/' + url);

        // Set the volume of the new song to the current volume
        song.volume = currentVolume;

        // Set up tracker max value to song duration when metadata loads
        song.addEventListener('loadedmetadata', function () {
            tracker.slider("option", "max", song.duration);
        });

        $('.playlist li').removeClass('active');
        elem.addClass('active');

        // Start updating the tracker using requestAnimationFrame
        updateTracker();
    }

    function updateTracker() {
        if (song && isPlaying) {
            tracker.slider('value', song.currentTime);
            requestAnimationFrame(updateTracker);
        }
    }

    function playAudio() {
        song.play();
        isPlaying = true;
        $('.play').addClass('hidden');
        $('.pause').addClass('visible');

        // Start updating the tracker on play
        requestAnimationFrame(updateTracker);
    }

    function stopAudio() {
        song.pause();
        isPlaying = false;
        $('.play').removeClass('hidden');
        $('.pause').removeClass('visible');
    }

    // Play click
    $('.play').click(function (e) {
        e.preventDefault();
        playAudio();
    });

    // Pause click
    $('.pause').click(function (e) {
        e.preventDefault();
        stopAudio();
    });

    // Forward click
    $('.fwd').click(function (e) {
        e.preventDefault();
        stopAudio();

        var next = $('.playlist li.active').next();
        if (next.length == 0) {
            next = $('.playlist li:first-child');
        }
        initAudio(next);
        playAudio();
    });

    // Rewind click
    $('.rew').click(function (e) {
        e.preventDefault();
        stopAudio();

        var prev = $('.playlist li.active').prev();
        if (prev.length == 0) {
            prev = $('.playlist li:last-child');
        }
        initAudio(prev);
        playAudio();
    });

    // Show playlist
    $('.pl').click(function (e) {
        e.preventDefault();
        $('.playlist').fadeIn(300);
    });

    // Playlist elements - click
    $('.playlist li').click(function (e) {
        e.preventDefault();
        stopAudio();
        initAudio($(this));
    });

    // Initialization - first element in playlist
    initAudio($('.playlist li:first-child'));

    // Initialize the volume slider
    volume.slider({
        range: 'min',
        min: 1,
        max: 100,
        value: currentVolume * 100,
        slide: function(event, ui) {
            currentVolume = ui.value / 100;
            if (song) {
                song.volume = currentVolume;
            }
        }
    });

    // Initialize the tracker slider
    tracker.slider({
        range: 'min',
        min: 0,
        max: 10, // temporary max, updated to song duration later
        slide: function(event, ui) {
            if (song) {
                song.currentTime = ui.value;
            }
        }
    });

    // Spacebar toggle play/pause
    document.body.onkeyup = function(e) {
        if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
            if (isPlaying) {
                stopAudio();
            } else {
                playAudio();
            }
        }
    };
});
