const APIController = (function() {
    
    const clientId = 'hidden';
    const clientSecret = 'hidden';

    // private methods
    const _getToken = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
    }

    const _getArtist = async (token) => {

        const result = await fetch(`https://api.spotify.com/v1/search?q=muse&type=artist`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        console.log(data)
        return data.artists.items;
    }

    const _getAlbumByArtist = async (token, artistID) => {
        
        const result = await fetch(`https://api.spotify.com/v1/artists/${artistID}/albums`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        console.log(data)
        return data.items;
    }

    const _getTracks = async (token, albumID) => {


        const result = await fetch(`https://api.spotify.com/v1/albums/${albumID}/tracks`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        console.log(data)
        return data.items;
    }

    
    const _getTrack = async (token, trackID) => {

        const result = await fetch(`https://api.spotify.com/v1/audio-features/${trackID}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const audioFeatures = await result.json();
        console.log(audioFeatures)
        return audioFeatures;
    }


    return {
        getToken() {
            return _getToken();
        },
        getArtist(token) {
            return _getArtist(token);
        },
        getAlbumByArtist(token, artistID) {
            return _getAlbumByArtist(token, artistID);
        },
        getTracks(token, albumID) {
            return _getTracks(token, albumID);
        },
        getTrack(token, trackID) {
            return _getTrack(token, trackID);
        }
    }
})();

// UI Module
const UIController = (function() {

    //object to hold references to html selectors
    const DOMElements = {
        selectArtist: '#select_artist',
        selectAlbum: '#select_album',
        buttonSubmit: '#btn_submit',
        divSongDetail: '#song-detail',
        hfToken: '#hidden_token',
        divSonglist: '.song-list'
    }

    //public methods
    return {

        //method to get input fields
        inputField() {
            return {
                artist: document.querySelector(DOMElements.selectArtist),
                album: document.querySelector(DOMElements.selectAlbum),
                tracks: document.querySelector(DOMElements.divSonglist),
                submit: document.querySelector(DOMElements.buttonSubmit),
                songDetail: document.querySelector(DOMElements.divSongDetail)
            }
        },

        // need methods to create select list option
        createartist(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectArtist).insertAdjacentHTML('beforeend', html);
        }, 

        createalbum(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectAlbum).insertAdjacentHTML('beforeend', html);
        },

        // need method to create a track list group item 
        createTrack(id, name) {
            const html = `<a href="#" class="list-group-item list-group-item-action justify-content-center" id="${id}">${name}</a>`;
            document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
        },

        resetTrackDetail() {
            this.inputField().songDetail.innerHTML = '';
        },

        resetTracks() {
            this.inputField().tracks.innerHTML = '';
            this.resetTrackDetail();
        },

        resetalbum() {
            this.inputField().album.innerHTML = '';
            this.resetTracks();
        },
        
        storeToken(value) {
            document.querySelector(DOMElements.hfToken).value = value;
        },

        getStoredToken() {
            return {
                token: document.querySelector(DOMElements.hfToken).value
            }
        }
    }

})();

const APPController = (function(UICtrl, APICtrl) {

    // get input field object ref
    const DOMInputs = UICtrl.inputField();

    // get artists on page load
    const loadartists = async () => {
        //get the token
        const token = await APICtrl.getToken();           
        //store the token onto the page
        UICtrl.storeToken(token);
        //get the artists
        const artists = await APICtrl.getArtist(token);
        //populate our artists select element
        artists.forEach(element => UICtrl.createartist(element.name, element.id));
    }

    // create artist change event listener
    DOMInputs.artist.addEventListener('change', async () => {
        //reset the album
        UICtrl.resetalbum();
        //get the token that's stored on the page
        const token = UICtrl.getStoredToken().token;        
        // get the artist select field
        const artistSelect = UICtrl.inputField().artist;       
        // get the artist id associated with the selected artist
        const artistID = artistSelect.options[artistSelect.selectedIndex].value;             
        // ge the album based on a artist
        const album = await APICtrl.getAlbumByArtist(token, artistID);       
        // create a album list item for every album returned
        album.forEach(p => UICtrl.createalbum(p.name, p.id));
    });
     

    // create submit button click event listener
    DOMInputs.submit.addEventListener('click', async (e) => {
        // prevent page reset
        e.preventDefault();
        // clear tracks
        UICtrl.resetTracks();
        //get the token
        const token = UICtrl.getStoredToken().token;        
        // get the album field
        const albumSelect = UICtrl.inputField().album;
        // get track endpoint based on the selected album
        const albumID = albumSelect.options[albumSelect.selectedIndex].value;
        // get the list of tracks
        const tracks = await APICtrl.getTracks(token, albumID);
        // create a track list item
        tracks.forEach(el => UICtrl.createTrack(el.href, el.name))
        
    });

    // create song selection click event listener
    DOMInputs.tracks.addEventListener('click', async (e) => {
        // prevent page reset
        e.preventDefault();
        UICtrl.resetTrackDetail();
        // get the token
        const token = UICtrl.getStoredToken().token;
        // get the track endpoint
        const trackID = e.target.id.replace('https://api.spotify.com/v1/tracks/', '');
        //get the track object
        const track = await APICtrl.getTrack(token, trackID);
        // load the track details
        //UICtrl.createTrackDetail(track.danceability);
        // get the audio features
        sessionStorage.setItem('danceability', track.danceability);
        sessionStorage.setItem('energy', track.energy);
        sessionStorage.setItem('key', track.key);
        sessionStorage.setItem('loudness', track.loudness);
        sessionStorage.setItem('speechiness', track.speechiness);
        sessionStorage.setItem('acousticness', track.acousticness);
        sessionStorage.setItem('instrumentalness', track.instrumentalness);
        sessionStorage.setItem('liveness', track.liveness);
        sessionStorage.setItem('valence', track.valence);
        sessionStorage.setItem('tempo', track.tempo);
        sessionStorage.setItem('duration_ms', track.duration_ms);
        sessionStorage.setItem('time_signature', track.time_signature);
        sessionStorage.setItem('track_id', track.id);
    });

    return {
        init() {
            loadartists();
        }
    }
})(UIController, APIController);


// will need to call a method to load the artists on page load
APPController.init();
