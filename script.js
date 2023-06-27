// incoming data
let data = {
    "playlist_name": "best music ever",
    "author": "beethaven",
    "playlist": {
        "1": {
            'songName': 'name 1',
            'artist': 'artist 1',
            'fileName': 'song_1.mp3'
        },
        "2": {
            'songName': 'name 2',
            'artist': 'artist 2',
            'fileName': 'song_2.mp3'
        },
        "3": {
            'songName': 'name 3',
            'artist': 'artist 3',
            'fileName': 'song_3.mp3'
        },
        "4": {
            'songName': 'name 4',
            'artist': 'artist 4',
            'fileName': 'song_4.mp3'
        },
        "5": {
            'songName': 'name 5',
            'artist': 'artist 5',
            'fileName': 'song_5.mp3'
        },
    },
};


// query selectors
let playlistTitle = document.querySelector('.playlist-title') || null
let playlistSongs = document.querySelector('.song-list') || null

let playContainer = document.querySelector('.play-container') || null

let pauseButton = document.getElementById('pause') || null
let playButton = document.getElementById('play') || null

let nextButton = document.getElementById('nextButton') || null
let prevButton = document.getElementById('prevButton') || null

let songId = document.getElementById('song_id') || null
let songSrc = document.getElementById('song_src') || null

let songName = document.getElementById('song-name') || null

let progressBar = document.querySelector('.progress-bar') || null

let currentDuration = document.querySelector('.current-duration') || null
let totalDuration = document.querySelector('.total-duration') || null

let volumeIconContainer = document.querySelector('.volume-icon-container') || null
let volumeControl = document.querySelector('.volume-controls') || null


// button event listeners
playButton.addEventListener("click", handlePlay);
nextButton.addEventListener("click", handleNext);
prevButton.addEventListener("click", handlePrev);

// audio event listners
songId.addEventListener('canplaythrough', handleAudioReady);
songId.addEventListener('ended', handleNext);

// loading bar event listener
progressBar.addEventListener('click', handleSeek);
progressBar.addEventListener('mousemove', handleTooltip);
progressBar.addEventListener('mouseout', handleExitTooltip);

// music controls
volumeIconContainer.addEventListener('click', handleMute);
volumeControl.addEventListener('click', handleChangeVolume);
volumeControl.addEventListener('mousemove', handleVolumeHover);
volumeControl.addEventListener('mouseout', handleExitVolumeHover);


// page variables
let queue = null;
let currentIndex = 0;
let previousVolume = 0.5;


// set up a queue on page inital load
(function initQueue() {
    queue = Object.values(data.playlist)
})();

// fires on page load and sets volume to 50%
(function initVolume() {
    songId.volume = previousVolume;
})();

// set up song list on main page
(function initPlaylistSongs (queue) {
    // change playlist title and song name on initial load
    playlistTitle.textContent = data.playlist_name;
    songName.textContent = queue[currentIndex % queue.length].songName;

    queue.map((song, index) => {
        // console.log(song.songName)
        let listElement = document.createElement('li');
        listElement.innerHTML = `<p>${index + 1}</p> <p>${song.songName}</p> <p>album ${index + 1}</p> <p>January 1 2000</p> <p>1:00</p>`
        playlistSongs.appendChild(listElement)
    });

})(queue);

// create a timer that fires every 500ms
(function initTimer() {
    let intervalId = setInterval(() => {
        currentDuration.textContent = convertSeconds(Math.round(Number(songId.currentTime)));
    }, 500)
})();

// toggle mute when the icon is clicked
function handleMute() {
    if (songId.volume === 0) {
        songId.volume = previousVolume;
        volumeControl.style.setProperty('--volumeBarFill', `${previousVolume*100}%`);
        volumeControl.style.setProperty('--volumeCirclePosition', `translate(${previousVolume*volumeControl.offsetWidth-6}px, -8px)`);
    } else {
        previousVolume = songId.volume;
        songId.volume = 0;
        volumeControl.style.setProperty('--volumeBarFill', `${0}%`);
        volumeControl.style.setProperty('--volumeCirclePosition', `translate(${0}px, -8px)`);
    };

    changeVolumeIcon(songId.volume);
};

// change the volume on click
function handleChangeVolume(e) {
    let volumeFraction = e.offsetX/volumeControl.offsetWidth;
    let volumeTo = (volumeFraction >= 1) ? 1 : (volumeFraction <= 0) ? 0 : volumeFraction;
    songId.volume = volumeTo;
    volumeControl.style.setProperty('--volumeBarFill', `${volumeFraction*100}%`);
    // console.log(e.offsetX)
    volumeControl.style.setProperty('--volumeCirclePosition', `translate(${(e.offsetX <= 0) ? 0 : (e.offsetX >= volumeControl.offsetWidth) ? volumeControl.offsetWidth - 8 : e.offsetX - 6}px, -8px)`);
    // console.log(volumeTo, songId.volume);
    changeVolumeIcon(volumeTo);
};

// change volume icon when called
function changeVolumeIcon(volumeTo) {
    volumeTo = (volumeTo >= 1) ? 1 : (volumeTo <= 0) ? 0 : volumeTo;

    if (volumeTo > .66) {
        volumeIconContainer.innerHTML = `<svg id="volume-icon" class="MuiSvgIcon-root MuiSvgIcon-fontSizeLarge  css-c1sh5i" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="VolumeUpIcon" aria-label="fontSize large"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg>`
    } else if (volumeTo > .33) {
        volumeIconContainer.innerHTML = `<svg id="volume-icon" class="MuiSvgIcon-root MuiSvgIcon-fontSizeLarge  css-c1sh5i" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="VolumeDownIcon" aria-label="fontSize large"><path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"></path></svg>`
    } else if (volumeTo > 0) {
        volumeIconContainer.innerHTML = `<svg id="volume-icon" class="MuiSvgIcon-root MuiSvgIcon-fontSizeLarge  css-c1sh5i" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="VolumeMuteIcon" aria-label="fontSize large"><path d="M7 9v6h4l5 5V4l-5 5H7z"></path></svg>`
    } else if (volumeTo === 0) {
        volumeIconContainer.innerHTML = `<svg id="volume-icon" class="MuiSvgIcon-root MuiSvgIcon-fontSizeLarge  css-c1sh5i" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="VolumeOffIcon" aria-label="fontSize large"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z"></path></svg>`
    };
};

// enter volume hover and apply styles
function handleVolumeHover(e) {
    volumeControl.classList.add('volume-hover');
    volumeControl.style.setProperty('--volumeCircleVisibility', 'visible');
};

// exit volume hover and remove styles
function handleExitVolumeHover(e) {
    volumeControl.classList.remove('volume-hover');
    volumeControl.style.setProperty('--volumeCircleVisibility', 'hidden');
};


// create tool tip when hovering over progress bar
function handleTooltip (e) {
    let progressFraction = e.offsetX/progressBar.offsetWidth;
    let seekTo = progressFraction * songId.duration;
    totalDuration.textContent = convertSeconds(Math.round(Number(seekTo)));

    // set hover style
    progressBar.classList.add('progress-hover');
    progressBar.style.setProperty('--progressCircleVisibility', 'visible');
};

// create tool tip when hovering over progress bar
function handleExitTooltip (e) {
    totalDuration.textContent = convertSeconds(Math.round(Number(songId.duration)));

    // remove hover style
    progressBar.classList.remove('progress-hover');
    progressBar.style.setProperty('--progressCircleVisibility', 'hidden');
};

// get the fraction of the rectangle the user clicks and seek to that fraction of the song
function handleSeek (e) {
    let progressFraction = e.offsetX/progressBar.offsetWidth;
    let seekTo = progressFraction * songId.duration;
    songId.currentTime = seekTo;
    progressBar.style.setProperty('--progressDelay', `${-seekTo}s`);
};

// reset the animation whenever the audio is ready
function handleAudioReady() {
    // console.log(songId.duration)
    progressBar.style.setProperty('--visibility', 'visible');
    progressBar.style.setProperty('--progressBar', 'none');
    progressBar.style.setProperty('--progressCircle', 'none');
    setTimeout(() => {
        progressBar.style.setProperty('--progressBar', 'progressBar');
        progressBar.style.setProperty('--progressCircle', 'progressCircle');
    }, 100)
    
    progressBar.style.setProperty('--songDuration', `${songId.duration}s`);
    
    // set duration
    currentDuration.textContent = convertSeconds(Math.round(Number(songId.currentTime)));
    totalDuration.textContent = convertSeconds(Math.round(Number(songId.duration)));
};

// switch to play and stop music
function handlePause(e) {
    // e.preventDefault()
    // console.log('pause')

    if (playButton === null) {
        // console.log('replace')

        let element = document.createElement('div')
        
        let playContainer = document.querySelector('.play-container') || null
        playContainer.appendChild(element)
        playContainer.removeChild(document.querySelector('.play-container2'))
        element.innerHTML = `<svg id="play" class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiSvgIcon-root MuiSvgIcon-fontSizeLarge css-1shn170" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="PlayArrowIcon" tabindex="-1" title="PlayArrow"><path d="M8 5v14l11-7z"></path></svg>`

        pauseButton = null
        element.addEventListener("click", handlePlay);
        element.setAttribute('class', 'play-container2')

        if (!songId.paused) {
            songId.pause();
            // console.log(songId.duration)
            // progressBar.style.setProperty('--visibility', 'visible');
            progressBar.style.setProperty('--songDuration', `${songId.duration}s`);
            progressBar.style.setProperty('--progressBarToggle', 'paused');
        };

    };
};

// switch to pause and play music
function handlePlay(e) {
    e.preventDefault()
    // console.log('play')

    if (pauseButton === null) {
        // console.log('replace')

        let element = document.createElement('div')
        element.setAttribute('class', 'play-container2')

        let playContainer2 = document.querySelector('.play-container2') || null
        if (playContainer2 !== null) {
            playContainer.removeChild(playContainer2);
        } else {
            playContainer.removeChild(playButton);
        }

        element.innerHTML = `<svg id="pause" class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiSvgIcon-root MuiSvgIcon-fontSizeLarge css-1shn170" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="PauseIcon" tabindex="-1" title="Pause"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>`
        playContainer.appendChild(element)

        playButton = null;

        element.addEventListener("click", handlePause);
        
        // songId.volume = 0.5;

        if (songId.paused) {
            songId.play()
            progressBar.style.setProperty('--visibility', 'visible');
            progressBar.style.setProperty('--progressBarToggle', 'running');
            progressBar.style.setProperty('--songDuration', `${songId.duration}s`);
            // handleProgress()
        }
        
    }
};

// play last song in queue
function handlePrev(e) {
    e.preventDefault()
    // console.log('prev')

    // change attribute of src to the fileName of the last song
    currentIndex -= 1
    songId.setAttribute('src', queue[((currentIndex % queue.length) + queue.length) % queue.length].fileName)
    songSrc.setAttribute('src', queue[((currentIndex % queue.length) + queue.length) % queue.length].fileName)

    // console.log(songSrc)
    // console.log(songId.currentSrc)
    // progressBar.offsetHeight;

    progressBar.style.setProperty('--progressDelay', `${0}s`);

    handlePlay(e)
    // console.log(songName)
    songName.textContent = queue[((currentIndex % queue.length) + queue.length) % queue.length].songName
};

// play next song in queue
function handleNext(e) {
    e.preventDefault()
    // console.log('next')

    // change attribute of src to the fileName of the next song
    currentIndex += 1
    songId.setAttribute('src', queue[currentIndex % queue.length].fileName)
    songSrc.setAttribute('src', queue[currentIndex % queue.length].fileName)

    // console.log(songSrc)
    // console.log(songId.currentSrc)
    // progressBar.offsetHeight;

    progressBar.style.setProperty('--progressDelay', `${0}s`);

    handlePlay(e)
    songName.textContent = queue[currentIndex % queue.length].songName
};

// convert songs duration in s and returns a string of hh:mm:ss format
function convertSeconds (songDuration, data = {'result': ''}) {
    if (songDuration > 86400) {
        console.log('song cannot be greater than 24hrs')
    }

    let left;
    let right;

    left = Math.floor(songDuration / 60);
    right = songDuration % 60;

    (right < 9) ? data.result += `:0${right}` : data.result += `:${right}`

    if (left >= 60) {
        convertSeconds(left, data);
    } else {
        data.result += `:${left}`
    }

    return data['result'].slice(1, data.result.length).split(':').reverse().join(':')
};
