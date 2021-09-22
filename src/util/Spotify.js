const CLIENT_ID = "ea321e60ab764f47bf5d1b10492650f7";
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URI = "http://localhost:3000/";

//const SCOPES = ["user-read-currently-playing", "user-read-playback-state"];
//const SPACE_DELIMITER = "%20";
//const SCOPES_URL_PARAM = SCOPES.join(SPACE_DELIMITER);

//http://spotify-pry-igor.surge.sh/

let accessToken;

const Spotify = {

    getAccessToken() {
        if(accessToken) {
            return accessToken;
            //console.log(accessToken)
        } 
        
        // Check for access token match
        const currentAccessToken = window.location.href.match(/access_token=([^&]*)/);
        const currenExpirationTime = window.location.href.match(/expires_in=([^&]*)/);

        if(currentAccessToken && currenExpirationTime) {
            //window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`;
            accessToken = currentAccessToken[1];
            const expiresIn = Number(currenExpirationTime[1]);  //We receive an string value, that's what we need to convert it to a Number
            
            //This clears the parameters, allowing us to grab a new access token when it expires
            window.setTimeout(() => {
                accessToken = "";
            }, expiresIn * 10000);
            window.history.pushState("Access Token", null, "/");
            return accessToken;
        } else {
            window.location = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`;
        }
    },

    async search(term) {
        
        const accessToken = Spotify.getAccessToken();
        const endpoint = `https://api.spotify.com/v1/search?type=track&q=${term}`;
        const response = await fetch(endpoint, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if(response.ok) {
            const jsonResponse = await response.json();

            //Assigned the value of the tracks items and save them in a const tracks
            const tracks = jsonResponse.tracks.items;
            
            return tracks.map(track => {
                return {
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri,
                    preview_url: track.preview_url,
                    album_img: track.album.images[0].url
                }
            });

        } else {
            return [];
        }

    },

    async savePlaylist(playListName, trackUris) {
        const token = Spotify.getAccessToken();
        const headers = {
            "Authorization": `Bearer ${token}`
        };
        let userID;

        if(!playListName && !trackUris.length) {
            return;
        }
        
        try {
            const endpoint = "https://api.spotify.com/v1/me";
            const response = await fetch(endpoint, {
                headers: headers
            });

            if(response.ok) {
                const jsonResponse = await response.json();
                userID = jsonResponse.id;

                //Creating a Playlist in the User's account with POST request
                const endpointPlaylist = `https://api.spotify.com/v1/users/${userID}/playlists`;
                const responseSavePlaylist = await fetch(endpointPlaylist, {
                    method: "POST",
                    headers: headers,
                    body: JSON.stringify({
                        name: playListName,
                        description: "Created in Jammming"
                    })
                });

                if(responseSavePlaylist.ok) {
                    const jsonResponse = await responseSavePlaylist.json();
                    const playlistID = jsonResponse.id;
                    
                    //Adding items to the Playlist created in the User's account with POST request
                    const endpointAddItemsToPlayList = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;
                    const responseAddItemsToPlayList = await fetch(endpointAddItemsToPlayList, {
                        method: "POST",
                        headers: headers,
                        body: JSON.stringify({
                            uris: trackUris
                        })
                    });

                    if(responseAddItemsToPlayList.ok) {
                        const jsonResponse = await responseAddItemsToPlayList.json();
                        return jsonResponse;
                    }
                }
            }

            throw new Error("Not possible to save playlist");

        } catch (error) {
            console.log(error)
        }

        
        //Creating a Playlist in the User's account with POST request through WEB API
        /* try {
            

            throw new Error("Request failed...");

        } catch (error) {
            console.log(error);
        } */
    }

    /* getReturnedParams(hash) {
        accessToken = hash.match(/access_token=([^&]*)/);
        expiration = window.location.href.match(/expires_in=([^&]*)/);
        window.setTimeout(() => accessToken = "", expiration * 1000);
        window.history.pushState("Access Token", null, "/");
        //return accessToken[1];
        console.log(accessToken[1]);
    } */

}

export default Spotify;