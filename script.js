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
}

// queue setup
let queue = Object.values(data.playlist)
let currentIndex = 0
console.log(queue)

// query selectors
let playlistSongs = document.querySelector('.song-list') || null

let playContainer = document.querySelector('.play-container') || null

let pauseButton = document.getElementById('pause') || null
let playButton = document.getElementById('play') || null

let nextButton = document.getElementById('nextButton') || null
let prevButton = document.getElementById('prevButton') || null

let songId = document.getElementById("song_id") || null
let songSrc = document.getElementById("song_src") || null

let songName = document.getElementById("song_name") || null

let progressBar = document.querySelector('.progress-bar') || null

let currentDuration = document.querySelector('.current-duration') || null
let totalDuration = document.querySelector('.total-duration') || null

// let progressPseudo = window.getComputedStyle(progressBar, ':before');
// // console.log(progressPseudo)

// change on on initial load
songName.textContent = queue[currentIndex % queue.length].songName

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
progressBar.addEventListener('mouseout', handleExitTooltip)

// set up song list on main page
function initPlaylistSongs (e) {
    console.log('do')
    // document.createElement('div')
}

// create tool tip when hovering over progress bar
function handleTooltip (e) {
    let progressFraction = e.offsetX/progressBar.offsetWidth;
    let seekTo = progressFraction * songId.duration;
    totalDuration.textContent = convertSeconds(Math.round(Number(seekTo)));

    // set hover style
    progressBar.classList.add('progress-hover');
    progressBar.style.setProperty('--progressCircleVisibility', 'visible');
}

// create tool tip when hovering over progress bar
function handleExitTooltip (e) {
    totalDuration.textContent = convertSeconds(Math.round(Number(songId.duration)));

    // remove hover style
    progressBar.classList.remove('progress-hover');
    progressBar.style.setProperty('--progressCircleVisibility', 'hidden');
}

// get the fraction of the rectangle the user clicks and seek to that fraction of the song
function handleSeek (e) {
    let progressFraction = e.offsetX/progressBar.offsetWidth;
    let seekTo = progressFraction * songId.duration;
    songId.currentTime = seekTo
    progressBar.style.setProperty('--progressDelay', `${-seekTo}s`);
}

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
}

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

    }
}

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
            playContainer.removeChild(playContainer2)
        } else {
            
            playContainer.removeChild(playButton)
        }

        element.innerHTML = `<svg id="pause" class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiSvgIcon-root MuiSvgIcon-fontSizeLarge css-1shn170" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="PauseIcon" tabindex="-1" title="Pause"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"></path></svg>`
        playContainer.appendChild(element)

        playButton = null;

        element.addEventListener("click", handlePause);
        
        songId.volume = 0.5;

        if (songId.paused) {
            songId.play()
            progressBar.style.setProperty('--visibility', 'visible');
            progressBar.style.setProperty('--progressBarToggle', 'running');
            progressBar.style.setProperty('--songDuration', `${songId.duration}s`);
            // handleProgress()
        }
        
    }
}


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
}


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

}

// create a timer using an IFFE
(function createTimer() {
    let intervalId = setInterval(() => {
        currentDuration.textContent = convertSeconds(Math.round(Number(songId.currentTime)));
    }, 500)
})();


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
}


// handle the progress bar
// function handleProgress() {
//     console.log('song duration: ' + songId.duration)
//     console.log('current time: ' + songId.currentTime)
// }    