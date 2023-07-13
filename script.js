// incoming data
let data = {
    "playlist_name": "Liked Songs",
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
        listElement.style.padding = "6px 0 6px 0"
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
        volumeIconContainer.innerHTML = `<svg id="volume-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 8.99998V15H7L12 20V3.99998L7 8.99998H3ZM16.5 12C16.5 10.23 15.48 8.70998 14 7.96998V16.02C15.48 15.29 16.5 13.77 16.5 12ZM14 3.22998V5.28998C16.89 6.14998 19 8.82998 19 12C19 15.17 16.89 17.85 14 18.71V20.77C18.01 19.86 21 16.28 21 12C21 7.71998 18.01 4.13998 14 3.22998Z" fill="black"/></svg>`
    } else if (volumeTo > .33) {
        volumeIconContainer.innerHTML = `<svg id="volume-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18.5 12C18.5 10.23 17.48 8.71 16 7.97V16.02C17.48 15.29 18.5 13.77 18.5 12ZM5 9V15H9L14 20V4L9 9H5Z" fill="black"/></svg>`
    } else if (volumeTo > 0) {
        volumeIconContainer.innerHTML = `<svg id="volume-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M7 9V15H11L16 20V4L11 9H7Z" fill="black"/></svg>`
    } else if (volumeTo === 0) {
        volumeIconContainer.innerHTML = `<svg id="volume-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M16.5 12C16.5 10.23 15.48 8.71 14 7.97V10.18L16.45 12.63C16.48 12.43 16.5 12.22 16.5 12ZM19 12C19 12.94 18.8 13.82 18.46 14.64L19.97 16.15C20.63 14.91 21 13.5 21 12C21 7.72 18.01 4.14 14 3.23V5.29C16.89 6.15 19 8.83 19 12ZM4.27 3L3 4.27L7.73 9H3V15H7L12 20V13.27L16.25 17.52C15.58 18.04 14.83 18.45 14 18.7V20.76C15.38 20.45 16.63 19.81 17.69 18.95L19.73 21L21 19.73L12 10.73L4.27 3ZM12 4L9.91 6.09L12 8.18V4Z" fill="black"/></svg>`
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
        element.innerHTML = `<svg id="play" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M8 5V19L19 12L8 5Z" fill="black"/></svg>`

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

        element.innerHTML = `<svg id="pause" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M6 19H10V5H6V19ZM14 5V19H18V5H14Z" fill="black"/></svg>`
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
